package errbuddy

import grails.plugin.springsecurity.SpringSecurityService
import org.joda.time.DateTime

class User implements HasJsonBody {

	transient SpringSecurityService springSecurityService

	String username
	String password
	String name
	String email
	boolean forcePasswordChange
	boolean enabled = true
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired

	DateTime dateCreated, lastUpdated

	static transients = ['springSecurityService']

	static constraints = {
		username nullable: false, blank: false, unique: true
		email nullable: false, blank: false, unique: true
		password nullable: false, blank: false
		name nullable: false
	}

	static mapping = {
		password column: '`password`'
	}

	Set<Role> getAuthorities() {
		UserRole.findAllByUser(this).collect { it.role }
	}

	def beforeInsert() {
		encodePassword()
	}

	def beforeUpdate() {
		if (isDirty('password')) {
			encodePassword()
		}
	}

	protected void encodePassword() {
		password = springSecurityService?.passwordEncoder ? springSecurityService.encodePassword(password) : password
	}

	@Override
	Map getJsonBody() {
		[
			id                 : id,
			name               : name,
			username           : username,
			email              : email,
			enabled            : enabled,
			forcePasswordChange: forcePasswordChange,
			expired            : accountExpired,
			locked             : accountLocked,
			passwordExpired    : passwordExpired,
			roles              : UserRole.where { user == this }.list().role.authority
		]
	}
}
