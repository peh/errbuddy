package errbuddy

import grails.transaction.Transactional

@Transactional
class EntryCleanupService {

	def jesqueService

	@Transactional(readOnly = true)
	void handleEntryCleanupForApplication(App app) {
		// get all group id's
		log.debug "$app: getting groups ..."
		def groupIds = EntryGroup.createCriteria().list {
			eq('app', app)
			projections {
				property('id')
			}
		}
		log.debug "$app: found ${groupIds.size()} groups"

		groupIds.each { long entryGroupId ->
			EntryGroup group = EntryGroup.read(entryGroupId)
			log.debug "$app: $group: getting entries ..."
			def entryIds = Entry.createCriteria().list(max: 10000) {
				eq('entryGroup', group)
				lt('dateCreated', app.clearUntil)
				projections {
					property('id')
				}
			}
			log.debug "$app: $group: found ${entryIds.size()} entries"
			if (entryIds) {
				entryIds.each {
					jesqueService.enqueue(EntryDeleteJob.queueName, EntryDeleteJob, [it, true])
				}
			}
		}

	}
}
