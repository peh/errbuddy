package errbuddy

class ApplicationDeploymentJob {

	static queueName = "generic"

	def applicationService

	def perform(def appId, def version, def hostname) {
		applicationService.addDeployment(appId as long, version, hostname)
	}
}
