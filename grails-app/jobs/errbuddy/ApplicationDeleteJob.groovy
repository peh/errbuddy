package errbuddy

class ApplicationDeleteJob {

	static queueName = "put"

	def applicationService

	def perform(Serializable id) {
		log.warn("deleting Application: $id")
		App app = App.read(id)
		if (!app)
			return
		applicationService.doDelete(app)
	}

}
