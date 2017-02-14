package errbuddy

import grails.converters.JSON
import grails.transaction.Transactional
import org.springframework.http.HttpStatus

@Transactional
class ApiController {

	static allowedMethods = [handle: "POST", deploy: "POST", ping: "GET"]

	def jesqueService

	def handle() {
		if (!request.app) {
			log.error "something went totally wrong binding an application to the request"
			response.status = 500
			render "BAD"
			return
		}

		def resp = [:]
		def json = request.JSON
		if (json.bucket && !json.type) {
			json.type = "$json.bucket".toUpperCase()
		}
		json.hostname = json.hostname ?: requestSource

		jesqueService.enqueue("put", EntryPutJob, [request.app.id, json.toString()])
		resp.message = 'ok'

		render(contentType: 'application/json') {
			resp
		}
	}

	def deploy() {
		def resp = [success: false]
		def json = request.JSON
		if (!json.version) {
			resp.message = 'missing parameter: [version]'
		} else {
			def hostname = json.hostname ?: requestSource
			jesqueService.enqueue("generic", ApplicationDeploymentJob, [request.app.id, json.version, hostname])
			resp.success = true
		}
		if (!resp.success) {
			response.status = HttpStatus.BAD_REQUEST.value()
		}
		render(contentType: 'application/json') {
			resp
		}
	}

	def ping() {
		render([success: "ok"] as JSON)
		return
		render(contentType: 'application/json', text: (([success: 'ok']) as JSON).toString())
	}

	/**
	 * render the latest version string of the requests application
	 */
	def latest() {
		render(contentType: 'application/json') {
			[version: request.app.appVersion]
		}
	}

	private getRequestSource() {
		request.getHeader('X-Real-IP') ?: request.remoteHost
	}
}
