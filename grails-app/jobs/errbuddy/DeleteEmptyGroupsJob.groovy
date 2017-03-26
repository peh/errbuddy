package errbuddy

class DeleteEmptyGroupsJob {

	// we put this one in the retention queue as they might deadlock each other
	static queueName = DataRetentionJob.queueName

	static triggers = {
		// 10 minutes after every hour
		cron name: 'DeleteEmptyGroupsJob',
			jesqueJobName: DeleteEmptyGroupsJob.name,
			jesqueQueue: queueName,
			cronExpression: "0 10 * ? * * *",
			args: []
	}

	def entryGroupService

	def perform() {
		entryGroupService.doDeleteEmpty()
	}
}
