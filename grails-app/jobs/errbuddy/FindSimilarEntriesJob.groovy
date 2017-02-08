package errbuddy

class FindSimilarEntriesJob {

	def entryService

	def perform(Serializable id) {
		Entry entry = Entry.get(id)
		if (entry)
			entryService.findSimilarGroup(entry)
		else
			log.error("$id is not a valid Entry")
	}
}
