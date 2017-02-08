package errbuddy

class MonitoringCheckJob {

	def monitoringCheckService

	def perform(long id) {
		Monitoring monitoring = Monitoring.get(id)
		monitoringCheckService.check(monitoring)
	}
}
