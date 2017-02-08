package errbuddy

import grails.transaction.Transactional
import org.joda.time.DateTime

@Transactional
class MonitoringCheckService {

	private static final int MAX_WAIT_TIME = 10000
	def grailsApplication

	def check(Monitoring monitoring) {
		long start = System.currentTimeMillis()
		def okay = doPing(monitoring.hostname, 1)
		long done = System.currentTimeMillis()
		MonitoringCheck monitoringCheck = new MonitoringCheck(monitoring: monitoring)
		updateMonitoringCheckResult(monitoringCheck, [success: okay, time: done - start])
		updateMonitoringStatus(monitoring, monitoringCheck, DateTime.now())
		if (monitoringCheck.validate()) {
			monitoringCheck.save()
			monitoring.save()
		} else {
			log.error("MontoringCheck could not be validated: $monitoringCheck.errors.allErrors")
		}
	}

	/**
	 * F*** windows, we go for unix-like ping only...
	 * @param host
	 * @param timeout
	 * @return
	 */
	boolean doPing(host, timeout) {
		def processString = "ping -c 1 -t $timeout $host"
		def result = processString.execute().waitFor()
		result == 0
	}

	def updateMonitoringCheckResult(MonitoringCheck monitoringCheck, Map resultJson) {
		switch (monitoringCheck.monitoring.type) {
			case Monitoring.Type.SERVER:
				monitoringCheck.okay = resultJson.success
				monitoringCheck.responseTime = resultJson.time
				break
			case Monitoring.Type.SERVICE:
				monitoringCheck.responseCode = resultJson.statusCode
				monitoringCheck.responseTime = resultJson.time
				monitoringCheck.okay = resultJson.statusCode == 200
				break
		}
	}

	/**
	 * uses information of the given check result and updates the status of the given monitoring
	 * if check was not okay the status is being set to RED
	 * if check is green but one of the latest 20 checks failed, it is set to YELLOW
	 * if check is green and none of the last 20 checks failed, it is set to GREEN
	 * also lastSuccess and lastChecked is set and the given check is set as the latest
	 * @param monitoring
	 * @param monitoringCheck
	 * @param checkTime
	 * @return
	 */
	def updateMonitoringStatus(Monitoring monitoring, MonitoringCheck monitoringCheck, DateTime checkTime) {
		if (!monitoringCheck.okay) {
			monitoring.status = Monitoring.Status.RED
		} else {
			List<MonitoringCheck> latestChecks = MonitoringCheck.findAllByMonitoring(monitoring, [max: 20, sort: 'dateCreated', order: 'desc'])
			monitoring.lastSuccess = checkTime
			// find the last 20
			if (latestChecks.find { !it.okay }) {
				monitoring.status = Monitoring.Status.YELLOW
			} else {
				monitoring.status = Monitoring.Status.GREEN
			}
			if (latestChecks) {
				monitoring.averageResponseTime = latestChecks.sum { it.responseTime } / latestChecks.size()
			}
		}

		monitoring.lastChecked = checkTime
		monitoring.latestCheck = monitoringCheck
	}

	private String getServiceUrl(Monitoring monitoring) {
		switch (monitoring.type) {
			case Monitoring.Type.SERVER: return grailsApplication.config.application.services.ping.url
			case Monitoring.Type.SERVICE: return grailsApplication.config.application.services.urlcheck.url
		}
		null
	}

}
