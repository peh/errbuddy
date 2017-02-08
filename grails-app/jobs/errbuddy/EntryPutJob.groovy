package errbuddy

class EntryPutJob {

	def entryService

	def perform(Serializable applicationId, String data) {
		entryService.addEntryToApplication(applicationId, data)
	}
}
