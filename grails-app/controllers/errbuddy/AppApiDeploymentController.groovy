package errbuddy

class AppApiDeploymentController extends AbstractAppApiController {

	static allowedMethods = [list: 'GET', delete: 'DELETE']

	def list() {
		sanitizeParams()
		withApplication(params.getLong('appId')) { App appl ->
			def total = Deployment.where { app == appl }.count()
			def list = Deployment.where { app == appl }.list(params)
			renderJson([deployments: list, total: total])
		}
	}

	def delete() {

	}
}
