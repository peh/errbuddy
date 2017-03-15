package errbuddy

class EntryDeleteJob {

	def entryService

	def perform(Serializable id, boolean doCheckLatest = true) {
		entryService.delete(id, doCheckLatest)
	}

}
