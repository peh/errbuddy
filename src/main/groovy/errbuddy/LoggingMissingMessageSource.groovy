package errbuddy

import org.springframework.context.support.AbstractMessageSource

import java.text.MessageFormat

class LoggingMissingMessageSource extends AbstractMessageSource {

	def messageBundleMessageSource

	@Override
	protected MessageFormat resolveCode(String code, Locale locale) {
		def format = messageBundleMessageSource.resolveCode(code, locale)
		if (!format)
			logger.error "Missing key $code"
		return format
	}
}
