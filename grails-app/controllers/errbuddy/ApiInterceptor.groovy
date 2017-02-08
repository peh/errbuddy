package errbuddy

import org.springframework.http.HttpStatus


class ApiInterceptor {

	ApiInterceptor() {
		match(controller: 'api', action: '*')
	}

	boolean before() {
		def resp = [:]
		def cont = false

		def apiKey = request.getHeader('key')

		if (!apiKey) {
			response.status = HttpStatus.BAD_REQUEST.value()
			resp.message = 'No Api key provided'
		} else {
			App app = App.findByApiKey(apiKey)
			if (!app) {
				response.status = HttpStatus.UNAUTHORIZED.value()
				resp.message = 'Invalid api key'
			} else {
				request.app = app
				cont = true
			}
		}

		if (!cont) {
			render(contentType: 'application/json') {
				resp
			}
		}
		return cont
	}

	boolean after() { true }

}
