package errbuddy

import grails.transaction.Transactional
import org.elasticsearch.action.search.SearchResponse
import org.elasticsearch.client.Client
import org.elasticsearch.index.query.QueryBuilder
import org.elasticsearch.index.query.QueryBuilders
import org.elasticsearch.search.aggregations.AggregationBuilders
import org.elasticsearch.search.aggregations.bucket.histogram.DateHistogram
import org.elasticsearch.search.sort.SortBuilders
import org.elasticsearch.search.sort.SortOrder
import org.joda.time.DateTime

@Transactional
class EntryGroupService {

	def entryService
	def jesqueService
	def elasticSearchHelper
	def grailsApplication
	def elasticSearchContextHolder

	Map getEntryGroupHistogram(EntryGroup entryGroup, int dayOffset = 0) {
		def newest = getNewest(entryGroup)
		def to = newest.time.minusDays(dayOffset)
		def from = newest.time.minusDays(1 + dayOffset)

		List result = doGetEntryGroupHistogram(entryGroup, from, to)
		def times = []
		def values = []
		def results = [:]
		result.each { agg ->
			results << [(DateTime.parse(agg.key).millis): agg.docCount]
		}
		results
	}

	private def doGetEntryGroupHistogram(EntryGroup entryGroup, DateTime from, DateTime to) {
		QueryBuilder entryGroupIdQuery = QueryBuilders.termQuery('entryGroup.entryGroupId', entryGroup.entryGroupId.toLowerCase())
		QueryBuilder timeBetween = QueryBuilders.rangeQuery("time")
			.from(from)
			.to(to)
			.includeLower(true)
			.includeUpper(true);
		QueryBuilder boolQuery = QueryBuilders.boolQuery().must(entryGroupIdQuery).must(timeBetween)
		SearchResponse res = null
		elasticSearchHelper.withElasticSearch { Client client ->
			res = client
				.prepareSearch(indexName)
				.setQuery(boolQuery)
				.addAggregation(AggregationBuilders.dateHistogram("time_agg").field('time').interval(DateHistogram.Interval.minutes(30)))
				.execute()
				.actionGet()
		}
		def results = res.aggregations.asMap.time_agg.buckets
		if (results.size() < 10 && to.minusDays(30).isBefore(from)) {
			from = from.minusDays(1)
			results = doGetEntryGroupHistogram(entryGroup, from, to)
		}
		results
	}

	def search(String query, List<App> applications) {
		def groups = []

		QueryBuilder appQuery = QueryBuilders.boolQuery().minimumShouldMatch("1")
		applications.each {
			appQuery = appQuery.should(QueryBuilders.matchQuery('entryGroup.app.id', it.id))
		}

		QueryBuilder qb = QueryBuilders.boolQuery()
			.must(appQuery)
		if (query) {
			qb = qb.must(QueryBuilders.queryStringQuery(query))
		}
		def response

		elasticSearchHelper.withElasticSearch { Client client ->
			response = client.prepareSearch(indexName)
				.setQuery(qb)
				.addField('id')
				.addAggregation(AggregationBuilders.terms('eg_agg').field('entryGroup.id').size(10000000))
				.addSort(SortBuilders.fieldSort('entryGroup.lastUpdated').order(SortOrder.DESC))
				.execute()
				.actionGet()
		}
		response?.aggregations?.get('eg_agg')?.buckets?.each {
			groups << (it.key as long)
		}
		groups
	}

	def similarest(Entry entry) {

		if (!entry.entryGroup) {
			log.fatal("$entry.id had no entry group. this should not happen!")
			return null
		}

		def musts = []
		musts << QueryBuilders.termQuery("entryGroup.app.id", entry.entryGroup.app.id)
		musts << QueryBuilders.termQuery("entryGroup.collector", false)

		if (entry.exception) {
			musts << QueryBuilders.termQuery("exception", entry.exception.toLowerCase())
		}
		if (entry.controllerName) {
			musts << QueryBuilders.termQuery("controllerName", entry.controllerName.toLowerCase())
			musts << QueryBuilders.termQuery("actionName", entry.actionName.toLowerCase())
		}

		QueryBuilder boolQuery = QueryBuilders.boolQuery().should(QueryBuilders.moreLikeThisFieldQuery("message").likeText(entry.message.toLowerCase()).minTermFreq(1).maxQueryTerms(12).percentTermsToMatch(0.9F).minDocFreq(1).minWordLength(3)).minimumShouldMatch("1")
		musts.each {
			boolQuery = boolQuery.must(it)
		}

		def groups

		elasticSearchHelper.withElasticSearch { Client client ->
			def response = client.prepareSearch(indexName)
				.setQuery(boolQuery)
				.addField('id')
				.addAggregation(AggregationBuilders.terms('eg_agg').field('entryGroup.entryGroupId'))

//            log.info response.toString()

			response = response.execute().actionGet()
			groups = response.aggregations.get('eg_agg').buckets

		}
		def result = null
		if (groups) {
			def maxAgg = groups.max { it.docCount }
			result = new String(maxAgg.termBytes.bytes)
		}
		result
	}

	def getIndexName() {
		def mapping = elasticSearchContextHolder.getMappingContextByType(Entry)
		mapping.queryingIndex
	}

	Entry getNewest(EntryGroup entryGroup) {
		Entry.findByEntryGroup(entryGroup, [order: 'desc', sort: 'time'])
	}

	def resolve(EntryGroup entryGroup, User user) {
		EntryGroup.withTransaction {
			EntryGroup locked = EntryGroup.lock(entryGroup.id)
			locked.resolved = true
			locked.resolvedBy = user
			locked.resolveDate = DateTime.now()
			locked.save(flush: true)
		}
	}

	def paginatedEntries(EntryGroup entryGroup, def params, Entry entry = null) {
		Entry.createCriteria().list(params) {
			eq('entryGroup', entryGroup)
			if (entry)
				notEqual('id', entry.id)
		}
	}

	def doDeleteGroup(Serializable entryGroupId, boolean deleteEntries) {
		EntryGroup toDelete = EntryGroup.get(entryGroupId)
		App app = toDelete.app
		toDelete.newest = null
		toDelete.deleted = true
		toDelete.save(flush: true)
		def entries = Entry.createCriteria().list() {
			eq('entryGroup', toDelete)
			projections {
				property('id')
			}
		} as List

		entries.each { long id ->
			if (deleteEntries) {
				jesqueService.enqueue("put", EntryDeleteJob, [id, true])
			} else {
				jesqueService.enqueue("generic", FindSimilarEntriesJob, [id])
			}
		}
	}

	def startRefind(EntryGroup entryGroup) {
		jesqueService.enqueue("generic", DeleteEntryGroupJob, [entryGroup.id, false])
	}

	def deleteGroup(EntryGroup entryGroup) {
		jesqueService.enqueue("generic", DeleteEntryGroupJob, [entryGroup.id, true])
	}
}
