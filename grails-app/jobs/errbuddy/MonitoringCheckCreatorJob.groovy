package errbuddy

import org.joda.time.DateTime

class MonitoringCheckCreatorJob {

//    static triggers = {
//        // every minute
//        cron name: 'MonitoringCheckCreatorJob',
//                jesqueJobName: MonitoringCheckCreatorJob.simpleName,
//                jesqueQueue: "generic",
//                cronExpression: "0 * * ? * * *",
//                args: []
//    }

	def jesqueService

	def perform() {
		Monitoring.findAllByEnabled(true).eachWithIndex { Monitoring monitoring, i ->
			log.info "enqueuing check job for $monitoring.id"
			jesqueService.enqueueAt(DateTime.now().plusSeconds(i), QueueConfiguration.getQueueName(MonitoringCheckJob), MonitoringCheckJob, [monitoring.id])
		}
	}
}
