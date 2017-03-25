package errbuddy

class DeleteEmptyGroupsJob {

	static queueName = "generic"

	static triggers = {
		// 10 minutes after every hour
		cron name: 'DeleteEmptyGroupsJob',
			jesqueJobName: DeleteEmptyGroupsJob.simpleName,
			jesqueQueue: queueName,
			cronExpression: "0 10 * ? * * *",
			args: []
	}

	def entryGroupService

	def perform() {
		entryGroupService.doDeleteEmpty()
	}
}
