package errbuddy

import grails.transaction.Transactional

@Transactional
class EntryCleanupService {

	def jesqueService

	@Transactional(readOnly = true)
	void handleEntryCleanupForApplication(App app) {
		// get all group id's
		log.info "$app: getting groups ..."
		def groupIds = EntryGroup.createCriteria().list {
			eq('app', app)
			projections {
				property('id')
			}
		}
		log.info "$app: found ${groupIds.size()} groups"

		groupIds.each { long entryGroupId ->
			EntryGroup group = EntryGroup.read(entryGroupId)
			log.info "$app: $group: getting entries ..."
			def entryIds = Entry.createCriteria().list(max: 10000) {
				eq('entryGroup', group)
				lt('dateCreated', app.clearUntil)
				projections {
					property('id')
				}
			}
			log.info "$app: $group: found ${entryIds.size()} entries"
			if (entryIds) {
//				log.info "deleting ${entryIds.size()} for $group.entryGroupId of $app.name"
				entryIds.each {
					jesqueService.enqueue(EntryDeleteJob.queueName, EntryDeleteJob, [it, true])
				}
			}
		}

	}
}
