package errbuddy

import groovy.util.logging.Log4j
import org.springframework.context.support.AbstractMessageSource

import java.text.MessageFormat

@Log4j
class RedisMessageSource extends AbstractMessageSource {

	def messageService

	@Override
	protected MessageFormat resolveCode(String code, Locale locale) {
		String msg
		try {
			msg = messageService.getMessage(code, locale)
		} catch (Exception e) {
			// ignore as we know this can happen
		}

		if (!msg)
			null
		else
			new MessageFormat(msg, locale)
	}

}
