package errbuddy

import grails.transaction.Transactional

@Transactional
class ConfigurationService {


	private static final String KEY_PREFIX = "config:errbuddy"

	def redisService
	def grailsApplication
	def flatConfig

	def get(def key) {
		grailsApplication.config.errbuddy."$key"
//        redisService.get(prefixKey(key))
	}

	def set(def key, def value) {
//        redisService.set(prefixKey(key), "$value")
	}

	Long getLong(def key) {
		get(key) as Long
	}

	Integer getInt(def key) {
		get(key) as Integer
	}


	private String prefixKey(def key) {
		"$KEY_PREFIX:$key"
	}

}
