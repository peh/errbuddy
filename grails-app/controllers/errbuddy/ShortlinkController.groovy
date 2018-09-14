package errbuddy

class ShortlinkController {

	def redirect(String identifier) {
		Entry entry = Entry.findByIdentifier(identifier)

		if (entry) {
			redirect(url: "$serverUrl/errors/$entry.entryGroup.entryGroupId/$entry.id")
		} else {
			redirect(url: serverUrl)
		}
	}

	private String getServerUrl() {
		grailsApplication.config.grails.serverURL ?: 'http://localhost:9000'
	}
}
