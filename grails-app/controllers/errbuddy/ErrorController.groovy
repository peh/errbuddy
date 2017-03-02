package errbuddy

import grails.converters.JSON
import grails.plugins.errbuddy.ErrbuddyService
import grails.util.Environment

class ErrorController {

	ErrbuddyService errbuddyService

	def error() {
		Throwable exception = request.exception
		String identifier = errbuddyService.getErrbuddyIdentifier(request)

		response.status = 500
		String errorMessage = 'Something went wrong.'

		if (Environment.current != Environment.PRODUCTION) {
			errorMessage = "Error in ${exception?.className} line ${exception?.lineNumber} : ${exception?.cause?.toString()}"
		}

		render(contentType: 'application/json', text: ([error: errorMessage, errbuddyIdentifier: identifier] as JSON).toString())
	}

	def notAllowed() {
		render(contentType: 'application/json', text: ([error: "not_allowed"] as JSON).toString())
	}
}
