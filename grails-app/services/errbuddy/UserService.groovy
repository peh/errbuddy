package errbuddy

import grails.transaction.Transactional

@Transactional
class UserService {

	def grailsApplication
	def springSecurityService

	User getCurrentUser() {
		def user = springSecurityService.currentUser
		if (user)
			user as User
		else {
			log.error "getCurrentUser was called although there was no user logged in. this should not happen!"
			null
		}
	}
}
