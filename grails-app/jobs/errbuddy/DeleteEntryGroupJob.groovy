package errbuddy

class DeleteEntryGroupJob {

	static queueName = "generic"

	def entryGroupService

	def perform(Serializable id, boolean deleteEntries) {
		entryGroupService.doDeleteGroup(id, deleteEntries)
	}
}
