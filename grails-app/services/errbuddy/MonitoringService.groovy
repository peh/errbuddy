package errbuddy

import grails.transaction.Transactional

@Transactional
class MonitoringService {

	private static final UPDATEABLE_PARAMS = ['name', 'enabled', 'hostname', 'url']

	Monitoring create(Map params) {
		Monitoring monitoring = new Monitoring()
		bindParams(monitoring, params)
		monitoring.type = Monitoring.Type.valueOf(params.type.toString())
		if (monitoring.validate()) {
			monitoring.save()
		}
		monitoring
	}

	Monitoring update(Map params, Monitoring monitoring) {
		bindParams(monitoring, params)
		if (monitoring.validate()) {
			monitoring.save()
		}
		monitoring
	}

	boolean delete(Monitoring toDelete) {
		toDelete.enabled = false
		toDelete.save(flush: true) // we have to disable all checks so we also have to flush here
		clear(toDelete)
		toDelete.delete()
	}

	boolean clear(Monitoring monitoring) {
		def count = MonitoringCheck.countByMonitoring(monitoring)
		(0..count).step(1000) { offset ->
			MonitoringCheck.findAllByMonitoring(monitoring, [max: 1000, offset: offset]).each {
				it.delete()
			}
		}
	}

	def bindParams(Monitoring monitoring, Map params) {
		UPDATEABLE_PARAMS.each { param ->
			def value = params[param]
			if (value == 'null')
				value = null
			if (value != monitoring[param])
				monitoring[param] = value
		}
	}

}
