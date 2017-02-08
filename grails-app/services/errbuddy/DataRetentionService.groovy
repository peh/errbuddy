package errbuddy

import grails.transaction.Transactional

@Transactional
class DataRetentionService {

	def jesqueService

	def handleDataRetentionForApplication(App app) {

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
		entries.each { long id ->
			jesqueService.enqueue("put", EntryDeleteJob, [id, true])
		}


	}
}
