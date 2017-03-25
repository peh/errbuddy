package errbuddy

import grails.converters.JSON
import grails.transaction.Transactional
import org.codehaus.groovy.grails.web.mapping.LinkGenerator
import org.joda.time.DateTime

@Transactional
class EntryService {

	def sendgridService
	def entryGroupService
	def elasticSearchService
	LinkGenerator grailsLinkGenerator
	def applicationService
	def jesqueService
	def grailsApplication

	def resolve(Entry entry) {
		entry.entryGroup.resolved = true
	}

	def findSimilar(Entry entry) {
		if (!entry.entryGroup) {
			log.fatal("$entry.id had no entry group. this should not happen!")
			return
		}


		def musts = [
			{ term("entryGroup.application.id": entry.entryGroup.appId) },
			{ term("entryGroup.collector": false) }
		]
		if (entry.exception)
			musts << { term("exception": entry.exception.toLowerCase()) }
		if (entry.controllerName) {
			musts << { term("controllerName": entry.controllerName.toLowerCase()) }
			musts << { term("actionName": entry.actionName.toLowerCase()) }
		}
		def possibleMatches = elasticSearchService.search([indices: Entry, types: Entry, from: 0, size: 100], {

			bool {
				must = musts
				should = [
					{
						"more_like_this"(
							"fields": ["message"],
							"like_text": entry.message.toLowerCase(),
							"min_term_freq": 1,
							"max_query_terms": 12,
							"percent_terms_to_match": 0.9,
							"min_doc_freq": 1,
							"min_word_length": 3
						)
					}
				]
				minimum_number_should_match = 1
			}
		})
		if (!possibleMatches.searchResults) {
			return []
		}

		Entry.createCriteria().list {
			inList('id', possibleMatches.searchResults.id)
			entryGroup {
				eq('app', entry.entryGroup.app)
			}
			projections {
				groupProperty('entryGroup')
				countDistinct('id')
			}
		}
	}

	void findSimilarGroup(Entry entry) {
		def similarId = entryGroupService.similarest(entry)
		EntryGroup entryGroup
		if (similarId) {
			entryGroup = EntryGroup.findByEntryGroupId(similarId)
			if (!entryGroup) {
				log.error("$similarId was not found as an entryGroup. this means we have some weird stuff in elasticsaerch")
				return
			}
		} else {
			entryGroup = new EntryGroup(app: entry.entryGroup.app).save() // save a new EntryGroup
		}

		entry.refindSimilar = false
		entry.save(flush: true)
		jesqueService.enqueue(PutIntoEntryGroupJob.queueName, PutIntoEntryGroupJob, [entryGroup.id, entry.id])
	}

	void addToEntryGroup(long entryGroupId, long entryId) {
		Entry entry = Entry.lock(entryId)
		EntryGroup entryGroup = EntryGroup.lock(entryGroupId)
		if (!entry || !entryGroup) {
			log.error("Entry (${entry?.id}) or EntryGroup (${entryGroup?.id} was not found")
		} else {
			entry.entryGroup = entryGroup
			entryGroup.lastUpdated = DateTime.now()
			entryGroup.resolved = false
			entryGroup.latest = entry
			entryGroup.entryCount = entryGroup.entryCount + 1
			entryGroup.save()
			entry.save()
		}
	}

	/**
	 * Adds an entry to the collector group of the given Application and sets the refindSimilar flag
	 * @param app
	 * @param entry
	 */
	void addToCollector(App app, Entry entry) {
		def collectorGroup = applicationService.getCollectorGroup(app)
		if (!collectorGroup) {
			log.warn("Application $app.id has no Collector Group!")
			return
		}
		entry.entryGroup = collectorGroup
		entry.refindSimilar = true
		entry.save();
	}

	/**
	 * Creates an entry and adds it to the collector group of the given application
	 * @param appId
	 * @param data
	 */
	void addEntryToApplication(Serializable appId, String data) {
		App app = App.get(appId)
		if (!app) {
			log.warn("Application $appId is not existing")
			return
		}
		def collectorGroup = EntryGroup.findByAppAndCollector(app, true)
		if (!collectorGroup) {
			log.warn("Application $appId has no Collector Group!")
			return
		}
		def json = JSON.parse(data)

		json.time = json.time ? new DateTime(json.time as long) : DateTime.now()
		Entry entry = new Entry(json)

		entry.stackTrace = json.stacktrace
		entry.actionName = json.action
		entry.controllerName = json.controller
		entry.serviceName = json.service
		if (json.level) {
			entry.entryLevel = Entry.EntryLevel.valueOf(json.level)
		}
		entry.entryGroup = collectorGroup

		// to be sure our json is parsed correctly
		if (!entry.validate()) {
			log.error("could not validate entry: $entry.errors.allErrors")
		} else {
			entry.save(flush: true)
			jesqueService.enqueue("generic", FindSimilarEntriesJob, [entry.id])
		}
	}

	void delete(Serializable id, boolean doCheckLatest) {
		Entry entry = Entry.get(id)
		if (!entry) {
			return // looks like this was done already
		}

		if (doCheckLatest) {
			EntryGroup.findByLatest(entry).each {
				it.latest = null
				it.save()
			}
		}
		entry.delete()
	}

	/**
	 * Enqueues a new FindSimilarEntriesJob for all Entries that are in a collector group, and have the refindSimilar flag
	 *
	 */
	void doRefindFromCollector() {
		Entry.createCriteria().list {
			inList('entryGroup', EntryGroup.findAllByCollector(true))
			eq('refindSimilar', true)
		}?.each { Entry entry ->
			jesqueService.enqueue("generic", FindSimilarEntriesJob, [entry.id])
		}
	}

}
