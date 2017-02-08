package errbuddy

class ApplicationCleanupJob {

	def dataRetentionService

	def perform(Serializable id) {
		App app = App.read(id)
		if (!app)
			return
		dataRetentionService.handleDataRetentionForApplication(app)
	}

}
