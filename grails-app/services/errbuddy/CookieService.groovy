package errbuddy

import grails.transaction.Transactional

import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Transactional
class CookieService {


	public static final String KEY_SELECTED_APP = 'selected-application'
	public static final String KEY_SIGNED_UP = 'email_signup'

	String get(String name, HttpServletRequest request) {
		getCookie(name, request)?.value
	}

	/**
	 * Set a cookie with name -> value, age
	 *
	 * @param name of the cookie
	 * @param value of the cookie
	 * @param age the cookie is supposed to be alive
	 */
	void set(String name, String value, HttpServletResponse response) {
		setCookie(name, value, 2592000, response)
	}

	/**
	 * Deletes the named cookie.
	 *
	 * @param name of the cookie
	 */
	void delete(String name, HttpServletResponse response) {
		setCookie(name, null, 0, response)
	}

	private void setCookie(String name, String value, Integer age, HttpServletResponse response) {
		Cookie cookie = new Cookie(name, value)
		cookie.setPath('/')
		cookie.setMaxAge(age)
//        if(configurationService.getBoolean('uberall.cookies.secureOnly')){
//            cookie.setSecure(true)
//        }
		response.addCookie(cookie)
		log.info "cookie added: ${name} = ${value}"
	}

	private Cookie getCookie(String name, HttpServletRequest request) {
		request.cookies.find { it.name == name }
	}

}
