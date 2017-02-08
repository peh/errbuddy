package errbuddy

import org.springframework.http.HttpStatus

class AppApiMonitoringController extends AbstractAppApiController {

	static allowedMethods = [list: 'GET', servers: 'GET', get: 'GET', update: 'PUT', create: 'POST', delete: 'DELETE', checks: 'GET', stats: 'GET']

	def monitoringService

	def create() {
		def monitoring = monitoringService.create(request.JSON as Map)
		if (monitoring.validate())
			renderJson([monitoring: monitoring])
		else {
			response.status = HttpStatus.BAD_REQUEST.value()
			renderJson([errors: monitoring.errors.allErrors])
		}
		if (monitoring.enabled) {
			jesqueService.enqueue("generic", MonitoringCheckJob, monitoring.id)
		}
	}

	def get() {
		withMonitoring { Monitoring monitoring ->
			renderJson([monitoring: monitoring])
		}
	}

	def checks() {
		withMonitoring { Monitoring monitoring ->
			sanitizeParams()
			def list = MonitoringCheck.findAllByMonitoring(monitoring, params)
			def total = MonitoringCheck.countByMonitoring(monitoring, params)
			renderJson(checks: list, total: total)
		}
	}

	def list() {
		Monitoring.Type type
		if (params.get("type")) {
			try {
				type = Monitoring.Type.valueOf(params.get("type").toString())
			} catch (Exception e) {
				response.status = HttpStatus.BAD_REQUEST.value()
				renderJson([type: 'invalid'])
				return
			}
		}
		def monitorings = Monitoring.createCriteria().list(params) {
			if (!params.getBoolean('showDisabled', false)) {
				eq('enabled', true)
			}
			if (type) {
				eq('type', type)
			}
			if (params.status && params.status in ['green', 'yellow', 'red']) {
				// we only allow red and green as status values
				eq('status', Monitoring.Status.valueOf(params.status.toString().toUpperCase()))
			}
		}
		renderJson([total: monitorings.totalCount, monitorings: monitorings, unfilteredTotal: Monitoring.count])
	}

	def update() {
		withMonitoring { Monitoring monitoring ->
			monitoringService.update(request.JSON as Map, monitoring)
			if (monitoring.validate())
				renderJson([monitoring: monitoring])
			else {
				response.status = HttpStatus.BAD_REQUEST.value()
				renderJson([errors: monitoring.errors.allErrors])
			}
			if (monitoring.enabled) {
				jesqueService.enqueue("generic", MonitoringCheckJob, monitoring.id)
			}
		}
	}

	def delete() {
		withMonitoring { Monitoring monitoring ->
			def deleted = monitoringService.delete(monitoring)
			renderJson([success: deleted])
		}
	}

	def stats() {
		def stats = [:]
		Monitoring.createCriteria().list {
			eq('enabled', true)
			projections {
				countDistinct('status')
			}
			groupProperty('status')
		}.each {
			stats[it[1]] = it[0]
		}

		renderJson([stats: stats])
	}

	private withMonitoring(Closure callable) {
		Monitoring monitoring = Monitoring.get(params.getLong('id'))
		if (!monitoring) {
			response.status = HttpStatus.NOT_FOUND.value()
		} else {
			callable.call monitoring
		}
	}
}
