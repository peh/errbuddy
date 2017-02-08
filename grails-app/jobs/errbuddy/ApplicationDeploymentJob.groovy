package errbuddy

class ApplicationDeploymentJob {

	def applicationService

	def perform(def appId, def version, def hostname) {
		applicationService.addDeployment(appId as long, version, hostname)
	}
}
