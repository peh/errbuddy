package errbuddy

import grails.transaction.Transactional

@Transactional
class EntryCleanupService {

	def jesqueService

	@Transactional(readOnly = true)
	void handleEntryCleanupForApplication(App app) {
		// get all group id's
		def groupsIds = EntryGroup.createCriteria().list {
			eq('app', app)
			ne('collector', true)
			projections {
				property('id')
			}
		}

		groupsIds.each { long entryGroupId ->
			EntryGroup group = EntryGroup.read(entryGroupId)
			def entryIds = Entry.createCriteria().list {
				eq('entryGroup', group)
				lt('dateCreated', app.clearUntil)
				projections {
					property('id')
				}
			}
			if (entryIds) {
				log.info "deleting ${entryIds.size()} for $group.entryGroupId of $app.name"
				entryIds.each {
					jesqueService.enqueue(EntryDeleteJob.queueName, EntryDeleteJob, [it, true])
				}
			}
		}

	}
}
