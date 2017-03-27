package errbuddy

import grails.core.GrailsApplication
import org.joda.time.DateTime

class EntryCleanupJob {

	static queueName = "cleanup"

	static triggers = {
		cron name: 'EntryCleanupJob',
			jesqueJobName: EntryCleanupJob.name,
			jesqueQueue: queueName,
			cronExpression: "*/30 * * * * ?",
			args: [0]
	}

	EntryCleanupService entryCleanupService
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
		entryCleanupService.handleEntryCleanupForApplication(app)
	}

}
