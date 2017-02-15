package errbuddy

import grails.plugins.jesque.JesqueService

class SettingsController extends AbstractApiController {

	static allowedMethods = [reindex: 'POST']

	JesqueService jesqueService

	def reindex() {
		jesqueService.enqueue('generic', ReindexJob)
		renderJson([success: "OK"])
	}

}
