package errbuddy

import grails.transaction.Transactional

@Transactional
class DataRetentionService {

	def jesqueService

	void handleDataRetentionForApplication(long id) {
		def app = App.read(id)
		if (!app) return

		int max = 10000
		def entries = Entry.createCriteria().list([max: max]) {
			entryGroup {
				eq('app', app)
			}
			lt('dateCreated', app.clearUntil)
			projections {
				property('id')
			}
		} as List

		log.info "deleting ${entries.size()} entries for $app.name"
		entries.each { long entryId ->
			jesqueService.enqueue("put", EntryDeleteJob, [entryId, true])
		}
	}
}
