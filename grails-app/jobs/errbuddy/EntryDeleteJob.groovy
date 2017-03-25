package errbuddy

class EntryDeleteJob {

	static queueName = "put"

	def entryService

	def perform(Serializable id, boolean doCheckLatest = true) {
		entryService.delete(id, doCheckLatest)
	}

}
