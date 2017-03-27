package errbuddy

import grails.transaction.Transactional

@Transactional
class EntryCleanupService {

	def jesqueService

	void handleEntryCleanupForApplication(App app) {
		int max = 500
		def entries = Entry.createCriteria().list([max: max, order: 'asc', sort: 'id']) {
			entryGroup {
				eq('app', app)
			}
			projections {
				property('id')
				property('dateCreated')
			}
		} as List

		def toDelete = entries.findAll { it[1].isBefore(app.clearUntil) }.collect { it[0] }.flatten()
		if (!toDelete) {
			return
		}

		log.info "deleting ${toDelete.size()} entries for $app.name"
		toDelete.each { long entryId ->
			jesqueService.enqueue(EntryDeleteJob.queueName, EntryDeleteJob, [entryId, true])
		}
	}
}
