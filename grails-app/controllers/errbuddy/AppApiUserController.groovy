package errbuddy

import org.springframework.http.HttpStatus

class AppApiUserController extends AbstractAppApiController {

	static allowedMethods = [roles: 'GET', me: 'GET', get: 'GET', list: 'GET', update: 'PUT', create: 'POST', delete: 'DELETE']

	def roles() {
		withUser(params.getLong("id")) { User user ->
			renderJson(roles: UserRole.where { user == currentUser }.list().role.authority)
		}
	}

	def me() {
		renderJson(me: currentUser)
	}

	def list() {
		sanitizeParams()
		renderJson([users: User.list(params)])
	}

	def get() {
		def rendered = false
		withUser(params.getLong("id") ?: -1L) { User user ->
			renderJson([user: user])
			rendered = true
		}
		if (!rendered) {
			renderJson([status: 'NOT_FOUND'])
		}
	}

	def update() {
		withUser { User user ->
			def requestUser = request.JSON
			bindData(user, requestUser, ['password', 'roles', 'dirty', 'errors'])
			if (requestUser.password) {
				user.password = requestUser.password
			}

			if (!user.enabled) {
				if (user.id == currentUser.id) {
					response.status = HttpStatus.FORBIDDEN.value()
					renderJson([message: "You cannot disable yourself"])
					user.discard()
				} else if (User.countByEnabled(true) == 1) {
					response.status = HttpStatus.FORBIDDEN.value()
					renderJson([message: "You cannot disable all users"])
					user.discard()
				}
			} else if (user.validate()) {
				//update roles
				UserRole.removeAll(user)
				if (requestUser.roles) {
					def roles = Role.findAllByAuthorityInList(requestUser.roles)
					roles.each { Role role ->
						UserRole.create(user, role)
					}
				}
				user.save(flush: true)
				renderJson([user: user])
			} else {
				user.discard()
				response.status = HttpStatus.BAD_REQUEST.value()
				renderJson([user: user, errors: user.errors.allErrors])
			}
		}
	}

	def create() {
		User user = new User()
		def requestUser = request.JSON
		bindData(user, requestUser, ['password', 'roles', 'dirty', 'errors'])
		if (requestUser.password) {
			user.password = requestUser.password
		}

		if (user.validate()) {
			//update roles
			UserRole.removeAll(user)
			user.save()
			if (requestUser.roles) {
				def roles = Role.findAllByAuthorityInList(requestUser.roles)
				roles.each { Role role ->
					UserRole.create(user, role)
				}
			}
			user.save(flush: true)
			renderJson([user: user])
		} else {
			user.discard()
			response.status = HttpStatus.BAD_REQUEST.value()
			renderJson([errors: user.errors.allErrors])
		}
	}

	def delete() {
		withUser() { User usr ->
			if (usr.id != currentUser.id) {
				UserRole.where { user == usr }.list().each { it.delete() }
				usr.delete()
				renderJson([success: true])
			} else {
				response.status = HttpStatus.FORBIDDEN.value()
				renderJson([message: "Users are not allowed to delete themselves"])
			}
		}
	}
}
