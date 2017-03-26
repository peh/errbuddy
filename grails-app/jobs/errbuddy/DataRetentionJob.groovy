package errbuddy

import grails.core.GrailsApplication
import org.joda.time.DateTime

class DataRetentionJob {

	static queueName = "put"

	static triggers = {
		cron name: 'DataRetentionJob',
			jesqueJobName: DataRetentionJob.simpleName,
			jesqueQueue: queueName,
			cronExpression: "0 */5 * * * ?",
			args: [0]
	}

	def dataRetentionService
	GrailsApplication grailsApplication

	def perform(long id = 0) {
		if (id) {
			App app = App.get(id)
			if (app) {
				handle(app)
			}
		} else {
			App.createCriteria().list {
				eq('enabled', true)
			}.each { App app ->
				handle(app)
			}
		}
	}

	void handle(App app) {
		DateTime until = DateTime.now().minusDays(grailsApplication.config.errbuddy.retentionDays ?: 90)
		if (!app.clearUntil || app.clearUntil.isBefore(until)) {
			app.clearUntil = until
			app.save()
		}
		dataRetentionService.handleDataRetentionForApplication(app)
	}

}
