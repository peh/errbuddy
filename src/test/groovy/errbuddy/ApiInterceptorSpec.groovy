package errbuddy


import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(ApiInterceptor)
class ApiInterceptorSpec extends Specification {

	def setup() {
	}

	def cleanup() {

	}

	void "Test api interceptor matching"() {
		when: "A request matches the interceptor"
		withRequest(controller: "api")

		then: "The interceptor does match"
		interceptor.doesMatch()
	}
}
