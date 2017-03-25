package errbuddy

class PutIntoEntryGroupJob {

	static queueName = "addToGroupQueue"

	def entryService

	def perform(entryGroupid, entryid) {
		if (entryGroupid && entryid) {
			Long entryGroupId = Long.parseLong("$entryGroupid")
			Long entryId = Long.parseLong("$entryid")
			entryService.addToEntryGroup(entryGroupId, entryId)
		} else {
			log.error("either entrygroupid ($entryGroupid) or entryid ($entryid) not given.")
		}
	}
}
