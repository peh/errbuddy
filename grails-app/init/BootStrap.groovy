import errbuddy.*
import grails.converters.JSON
import grails.plugins.errbuddy.ErrbuddyLogAppender

class BootStrap {


	private static final List ROLES = ['ROLE_ROOT', 'ROLE_ADMIN', 'ROLE_USER']
	def grailsApplication
	ApplicationService applicationService

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

	}

	def destroy = {
	}
}
