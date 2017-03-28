package errbuddy

class DeleteEntryGroupJob {

	static queueName = EntryDeleteJob.queueName

	def entryGroupService

	def perform(Serializable id, boolean deleteEntries) {
		entryGroupService.doDeleteGroup(id, deleteEntries)
	}
}
