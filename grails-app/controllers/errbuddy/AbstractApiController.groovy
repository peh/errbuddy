package errbuddy

import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityUtils
import org.springframework.http.HttpStatus

abstract class AbstractApiController {
	def configurationService
	def entryGroupService
	def userService
	def applicationService
	def jesqueService

	protected void renderJson(Map payload) {
		response.contentType = 'application/json'
		render payload as JSON
	}

	protected void sanitizeParams() {
		if (params.max) {
			def max = params.getLong("max")
			params.max = max > configurationService.getInt("maximumMax") ? configurationService.getInt("defaultMax") : max
		} else {
			params.max = configurationService.getInt("defaultMax")
		}
	}

	protected User getCurrentUser() {
		userService.currentUser
	}

	protected void withApplication(Long id = params.getLong('id'), Closure c) {
		if (!id) {
			response.status = HttpStatus.NOT_FOUND.value()
		} else {
			App app = App.get(id)
			if (app) {
				c.call app
			} else {
				response.status = HttpStatus.NOT_FOUND.value()
			}
		}
	}

	protected void withEntry(long id = params.getLong('id'), Closure c) {
		if (!id) {
			response.status = HttpStatus.BAD_REQUEST.value()
			renderJson(['MISSING_PARAMETER': 'id'])
		} else {
			Entry entry = Entry.get(id)
			if (!entry) {
				response.status = HttpStatus.NOT_FOUND.value()
			} else {
				c.call entry
			}
		}
	}

	protected void withEntryGroup(String entryGroupId, Closure closure) {
		if (!entryGroupId)
			response.status = HttpStatus.NOT_FOUND.value()
		else {
			EntryGroup entryGroup = EntryGroup.findByEntryGroupId(entryGroupId, [fetch: ['app': 'join']])
			if (!entryGroup) {
				response.status = HttpStatus.NOT_FOUND.value()
			} else {
				closure.call(entryGroup)
			}
		}
	}

	protected void withUser(long id = params.getLong('id'), Closure c) {
		if (!id) {
			response.status = HttpStatus.NOT_FOUND.value()
		} else {
			User user = User.get(id)
			if (!user) {
				response.status = HttpStatus.NOT_FOUND.value()
			} else if (user == currentUser || SpringSecurityUtils.ifAnyGranted('ROLE_ADMIN, ROLE_ROOT')) {
				c.call user
			} else {
				response.status = HttpStatus.FORBIDDEN.value()
			}
		}
	}
}
