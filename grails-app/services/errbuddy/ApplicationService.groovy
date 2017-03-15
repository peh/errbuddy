package errbuddy

import grails.transaction.Transactional
import org.joda.time.DateTime

@Transactional
class ApplicationService {

	def jesqueService
	def cookieService
	def userService

	EntryGroup getCollectorGroup(App app) {
		Long applicationId = app.id
		Long groupId = ErrbuddyConstants.COLLECTOR_MAP[applicationId]
		EntryGroup collector
		if (groupId) {
			// this should hit 2nd level cache if called multiple times in the same Session
			collector = EntryGroup.get(groupId)
		} else {
			collector = EntryGroup.findByAppAndCollector(app, true)
			ErrbuddyConstants.COLLECTOR_MAP[applicationId] = collector.id
		}
		collector
	}

	def create(App app) {
		if (app.validate()) {
			app.save()
			EntryGroup entryGroup = new EntryGroup(collector: 1, confirmed: 1, app: app)
			if (!entryGroup.validate()) {
				log.error("could not create collector for $app.name")
			} else {
				entryGroup.save()
			}
		}
		app
	}

	def clear(App app) {
		app.clearUntil = DateTime.now()
		app.save()
		// this will not clear all entries immediately
		// the scheduled data retention will take care of cleaning the app bit by bit
		jesqueService.enqueueAt(DateTime.now().plusSeconds(5), "put", DataRetentionJob, [app.id])
	}

	def delete(App app) {
		app.enabled = false
		app.save()
		jesqueService.enqueueAt(DateTime.now().plusSeconds(5), "put", ApplicationDeleteJob, [app.id])
	}

	def doDelete(App app) {
		app.filters?.each { Filter filter ->
			filter.filterItems?.each { FilterItem filterItem ->
				filterItem.delete()
			}
			filter.delete()
		}
		app.entryGroups?.each { EntryGroup entryGroup ->
			entryGroup.entries.each {
				it.delete()
			}
			entryGroup.delete()
		}
		app.deployments.each {
			it.delete()
		}
		app.delete(flush: true)
	}

	def addDeployment(long appId, String version, String hostname) {
		App app = App.get(appId)

		// if we have a new version, we will should ping users
		if (app.appVersion != version) {
			App.withTransaction {
				App locked = App.lock(app.id)
				locked.appVersion = version
				Deployment deployment = new Deployment(versionString: version, hostname: hostname)
				locked.addToDeployments(deployment)
				locked.save(failOnError: true, flush: true)
			}
		}
	}

}
