package errbuddy

class DeleteEntryGroupJob {

	def entryGroupService

	def perform(Serializable id, boolean deleteEntries) {
		entryGroupService.doDeleteGroup(id, deleteEntries)
	}
}
