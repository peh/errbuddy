package errbuddy

class RefindFromCollectorJob {

	static queueName = "generic"

    static triggers = {
        // every 2 hours
        cron name: 'RefindFromCollectorJob',
                jesqueJobName: RefindFromCollectorJob.simpleName,
                jesqueQueue: queueName,
                cronExpression: "0 * * ? * * *",
                args: []
    }


	def entryService

	def perform() {
		entryService.doRefindFromCollector()
	}
}
