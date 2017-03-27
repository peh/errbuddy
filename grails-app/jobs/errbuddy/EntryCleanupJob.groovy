package errbuddy

import grails.core.GrailsApplication
import grails.plugins.jesque.JesqueService
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
	JesqueService jesqueService

	def perform(long id = 0) {
		if (id) {
			App app = App.get(id)
			if (app) {
				handle(app)
			}
		} else {
			App.createCriteria().list {
				eq('enabled', true)
				projections {
					property('id')
				}
			}.each {
				jesqueService.enqueue(queueName, EntryCleanupJob, [it])
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
