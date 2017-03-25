package errbuddy

class ReindexJob {

	static queueName = "generic"

	def elasticSearchService
	def elasticSearchAdminService

	def perform() {
		elasticSearchService.index(Entry)
		elasticSearchAdminService.refresh()
	}
}
