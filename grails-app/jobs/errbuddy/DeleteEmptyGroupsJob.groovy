package errbuddy

class DeleteEmptyGroupsJob {

	static triggers = {
		// 10 minutes after every hour
		cron name: 'DeleteEmptyGroupsJob',
			jesqueJobName: DeleteEmptyGroupsJob.simpleName,
			jesqueQueue: "generic",
			cronExpression: "0 10 * ? * * *",
			args: []
	}

	def entryGroupService

	def perform() {
		entryGroupService.doDeleteEmpty()
	}
}
