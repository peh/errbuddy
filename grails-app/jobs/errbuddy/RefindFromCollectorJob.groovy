package errbuddy

class RefindFromCollectorJob {

	static queueName = "refind"

// trigger is disabled for now
//    static triggers = {
//        // every 2 hours
//        cron name: 'RefindFromCollectorJob',
//                jesqueJobName: RefindFromCollectorJob.name,
//                jesqueQueue: queueName,
//                cronExpression: "0 * * ? * * *",
//                args: []
//    }


	def entryService

	def perform() {
		entryService.doRefindFromCollector()
	}
}
