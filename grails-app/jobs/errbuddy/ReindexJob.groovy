package errbuddy

class ReindexJob {

	def elasticSearchService
	def elasticSearchAdminService

	def perform() {
		elasticSearchService.index(Entry)
		elasticSearchAdminService.refresh()
	}
}
