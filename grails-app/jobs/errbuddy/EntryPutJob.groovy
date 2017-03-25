package errbuddy

class EntryPutJob {

	static queueName = "put"

	def entryService

	def perform(Serializable applicationId, String data) {
		entryService.addEntryToApplication(applicationId, data)
	}
}
