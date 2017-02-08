package errbuddy

class RefindFromCollectorJob {

    static triggers = {
        // every 2 hours
        cron name: 'RefindFromCollectorJob',
                jesqueJobName: RefindFromCollectorJob.simpleName,
                jesqueQueue: "generic",
                cronExpression: "0 * * ? * * *",
                args: []
    }


	def entryService

	def perform() {
		entryService.doRefindFromCollector()
	}
}
