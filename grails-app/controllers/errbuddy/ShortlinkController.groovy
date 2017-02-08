package errbuddy

class ShortlinkController {

	def redirect(String identifier) {
		Entry entry = Entry.findByIdentifier(identifier)
		if (entry) {
			redirect(url: "$grailsApplication.config.errbuddy.appUrl/$entry.entryGroup.entryGroupId/$entry.id")
		} else {
			redirect(url: grailsApplication.config.errbuddy.appUrl)
		}
	}
}
