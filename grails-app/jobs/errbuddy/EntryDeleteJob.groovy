package errbuddy

class EntryDeleteJob {

	def perform(Serializable id, boolean doCheckLatest = true) {

		Entry entry = Entry.get(id)
		if (!entry) {
			return // looks like this was done already
		}

		if (doCheckLatest) {
			EntryGroup.findByLatest(entry).each {
				it.latest = null
				it.save()
			}
		}
		entry.delete()
	}

}
