package errbuddy

import grails.transaction.Transactional
import org.apache.commons.lang.LocaleUtils
import org.springframework.web.context.request.RequestContextHolder
import redis.clients.jedis.Jedis

@Transactional
class MessageService {

	def redisService
	def grailsApplication
	def messageBundleMessageSource

	public static final String BASE_KEY = 'errbuddy.message'
	public static final String MESSAGE_MISSING_LIST_BASE = 'errbuddy._missing.message'

	String getMessage(String code, Locale locale) {
		if (RequestContextHolder.currentRequestAttributes().session?.showMessageCodes == true) {
			return code
		}
		if (!(locale.language in supportedLanguages)) {
			locale = defaultLocale
		}
		def message = null
		redisService.withRedis { Jedis jedis ->
			message = jedis.hget(getKey(code), getFieldName(locale))
			if (!message) {
				message = messageBundleMessageSource.resolveCode(code, locale)?.pattern
				if (!message || message == code) {
					jedis.sadd(getMissingKey(locale), code)
				} else {
					setMessage(message, code, locale)
				}
			}
		}
		message
	}

	Map getMessageHash(String key) {
		redisService.hgetAll(getKey(key))
	}

	List<String> getList(int max, int offset, String query = "") {
		def result = []
		redisService.withRedis { Jedis jedis ->
			result = jedis.keys("${BASE_KEY}*$query*").sort()
		}
		if (offset + max > result.size())
			offset = result.size() - max
		offset = offset >= 0 ? offset : 0
		max = result.size() > max ? max : result.size()
		result = result.subList(offset, offset + max).collect { String key ->
			key.replace("${BASE_KEY}.", '')
		}
		result
	}

	def getKeyTotalCount(String query = "") {
		redisService.keys("${BASE_KEY}*$query*")?.size() ?: 0
	}

	Map<String, Map<String, String>> getExportMap() {
		Map<String, Map<String, String>> propMap = [:]
		supportedLanguages.each {
			propMap << [(it): [:]]
		}
		redisService.withRedis { Jedis jedis ->
			def list = jedis.keys("${BASE_KEY}.*").sort()
			list.each { String key ->
				def hash = jedis.hgetAll(key)
				key = key.replace("${BASE_KEY}.", '')
				hash.each { String language, String text ->
					propMap[language] << [(key.trim()): text.trim()]
				}
			}
		}
		propMap
	}

	List<String> getMissingKeys(Locale locale = defaultLocale) {
		if (!(locale.language in supportedLanguages)) {
			locale = defaultLocale
		}
		def result = []
		redisService.withRedis { Jedis jedis ->
			result = jedis.smembers(getMissingKey(locale)).sort()
		}
		result
	}

	void setMessage(String message, String code, Locale locale) {
		redisService.withRedis { Jedis jedis ->
			jedis.hset(getKey(code), getFieldName(locale), message)
			jedis.srem(getMissingKey(locale), code)
		}
	}

	void resetMissing() {
		redisService.withRedis { Jedis jedis ->
			def keys = jedis.keys("${MESSAGE_MISSING_LIST_BASE}*")
			keys.each { String key -> jedis.del(key) }
		}
	}

	Locale parseLocaleString(String localeString) {
		if (!localeString)
			return defaultLocale
		Locale parsed = LocaleUtils.toLocale(localeString)
		if (!(parsed.language in supportedLanguages)) {
			parsed = defaultLocale
		}
		return parsed
	}

	String getFieldName(Locale locale) {
		"${locale.language}"
	}

	String getKey(String code) {
		"${BASE_KEY}.${code}"
	}

	String getMissingKey(Locale locale) {
		"${MESSAGE_MISSING_LIST_BASE}.${getFieldName(locale)}"
	}

	List<String> getSupportedLanguages() {
		grailsApplication.config.errbuddy.supportedLanguages
	}

	Locale getDefaultLocale() {
		LocaleUtils.toLocale("${grailsApplication.config.errbuddy.defaultLanguage}")
	}

}
