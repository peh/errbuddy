package errbuddy

class ReindexJob {

	def elasticSearchService
	def elasticSearchAdminService

	def perform() {

		Entry.withSession { session ->
			def total = Entry.count
			0.step(total, 500) {
				elasticSearchService.index(Entry.list([offset: it, max: 500]))
				log.info "indexed till $it"
				session.flush()
				session.clear()
			}
		}

		elasticSearchAdminService.refresh()
	}
}
