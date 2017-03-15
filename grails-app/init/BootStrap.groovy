import errbuddy.*
import grails.converters.JSON
import grails.plugins.errbuddy.ErrbuddyLogAppender
import grails.plugins.errbuddy.ErrbuddyService
import grails.plugins.jesque.JesqueService

class BootStrap {


	private static final List ROLES = ['ROLE_ROOT', 'ROLE_ADMIN', 'ROLE_USER']
	def grailsApplication
	ApplicationService applicationService
	ErrbuddyService errbuddyService
	JesqueService jesqueService

	private static final List WORKERS = [
		[
			queueName: "add_to_group",
			count    : 1,
			jobs     : [
				PutIntoEntryGroupJob
			]
		],
		[
			queueName: "put",
			count    : 1,
			jobs     : [
				ApplicationDeleteJob,
				DataRetentionJob,
				EntryPutJob,
				EntryDeleteJob
			]
		],
		[
			queueName: "generic",
			count    : 3,
			jobs     : {
				return [
					ApplicationDeploymentJob,
					DeleteEmptyGroupsJob,
					DeleteEntryGroupJob,
					FindSimilarEntriesJob,
					MonitoringCheckJob,
					MonitoringCheckCreatorJob,
					RefindFromCollectorJob,
					ReindexJob,
				]
			}
		]
	]

	def init = { servletContext ->
		JSON.registerObjectMarshaller(HasJsonBody) { HasJsonBody b ->
			b.jsonBody
		}

		JSON.registerObjectMarshaller(Enum) { Enum someEnum ->
			someEnum.toString()
		}

		ErrbuddyLogAppender.instance.enable()

		log.info "Bootstrapping done"

		ROLES.each { String auth ->
			Role.findOrCreateByAuthority(auth).save(failOnError: true)
			log.info "created $auth"
		}

		if (!User.count) {
			User user = new User(
				name: 'admin',
				username: 'admin',
				password: 'admin',
				email: 'admin@domain.com'
			)
			user.save()

			UserRole.create(user, Role.findByAuthority('ROLE_ROOT'), true)
			println "Created default user 'admin' with password: 'admin'"
		}

		if (!App.count) {
			App app = new App(
				name: 'errbuddy-self',
				apiKey: grailsApplication.config.grails.plugin.errbuddy.apiKey,
				appVersion: "1.0.0"
			)
			applicationService.create(app)
		}

//		if (System.getProperty('errbuddy.worker.skip') != 'true') {
		new Timer().runAfter(10000) {
			log.info "starting workers"
			WORKERS.each { workerConfig ->
				def jobs = workerConfig.jobs
				if (jobs instanceof Closure) {
					jobs = jobs.call()
				}
				if (jobs instanceof List) {
					jobs = jobs.collectEntries {
						return [(it.simpleName): it]
					}
				}
				workerConfig.count.times {
					jesqueService.startWorker(workerConfig.queueName as String, jobs as Map)
				}
			}
			jesqueService.enqueue('generic', RefindFromCollectorJob)
			log.info "workers started"
		}
//		}
	}

	def destroy = {
	}
}
