package errbuddy.app

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import groovy.util.logging.Slf4j
import org.springframework.context.EnvironmentAware
import org.springframework.core.env.Environment
import org.springframework.core.env.MapPropertySource

@Slf4j
class Application extends GrailsAutoConfiguration implements EnvironmentAware {

	static void main(String[] args) {
		GrailsApp.run(Application, args)
	}

	@Override
	void setEnvironment(Environment environment) {
		def configLocation = externalConfigLocation
		log.info("searching for external configuration at $configLocation")

		File file = new File(configLocation)
		if (file.exists()) {
			log.info "adding external configuration from $configLocation"
			def config = new ConfigSlurper().parse(file.toURI().toURL())
			environment.propertySources.addFirst(new MapPropertySource("UberallConfig", config))
		} else {
			log.warn "No External config found at @$configLocation"
		}
	}

	private static String getExternalConfigLocation() {
		if (env.isDevelopmentMode() || env == grails.util.Environment.TEST) {
			'local/errbuddy-config.groovy'
		} else {
			'/opt/errbuddy/errbuddy.groovy'
		}
	}

	private static grails.util.Environment getEnv() {
		grails.util.Environment.current
	}
}
