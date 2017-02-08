package errbuddy

import grails.plugins.jesque.JobExceptionHandler
import groovy.util.logging.Log4j
import net.greghaines.jesque.Job

@Log4j
class CustomExceptionHandler implements JobExceptionHandler {

	@Override
	def onException(Exception exception, Job job, String curQueue) {
		log.error("error handling ${job.class.simpleName} in ${curQueue}", exception)
		null
	}
}
