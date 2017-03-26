package errbuddy

import org.springframework.http.HttpStatus

class ApplicationController extends AbstractApiController {

	static allowedMethods = [select: 'POST', details: 'GET', list: 'GET', add: 'POST', update: 'PUT', delete: 'DELETE']

	def details() {
		withApplication { App app ->
			renderJson([application: app, errorCount:  app.errorCount])
		}
	}

	def list() {
		sanitizeParams()
		def applications = App.createCriteria().list(params) {
			eq('enabled', true)
		}
		renderJson([applications: applications, total: applications.totalCount])
	}

	def add() {
		def json = request.JSON
		def app = new App(name: json.name)
		app = applicationService.create(app)
		if (!app.validate()) {
			response.status = HttpStatus.BAD_REQUEST.value()
			renderJson(errors: app.errors.allErrors)
		} else {
			renderJson([application: app])
		}
	}

	def update() {
		withApplication { App app ->
			// as only updating the name is allowed for now, we only update the name here.
			app.name = request.JSON.name
			if (app.validate()) {
				app.save()
				renderJson([application: app])
			} else {
				app.discard()
				response.status = HttpStatus.BAD_REQUEST.value()
				renderJson(errors: app.errors.allErrors)
			}
		}
	}

	def clear() {
		withApplication { App app ->
			applicationService.clear(app)
			renderJson([success: "ok"])
		}
	}

	def delete() {
		withApplication { App app ->
			applicationService.delete(app)
			renderJson([success: "ok"])
		}
	}
}
