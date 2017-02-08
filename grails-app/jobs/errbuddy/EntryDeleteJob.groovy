package errbuddy

class EntryDeleteJob {

	def perform(Serializable id, boolean doCheckNewest = true) {

		Entry entry = Entry.get(id)
		if (!entry) {
			return // looks like this was done already
		}

		if (doCheckNewest) {
			EntryGroup.findByNewest(entry).each {
				it.newest = null
				it.save()
			}
		}
		entry.delete()
	}

}
