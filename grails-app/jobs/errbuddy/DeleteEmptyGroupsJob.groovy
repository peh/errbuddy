package errbuddy

class DeleteEmptyGroupsJob {

//    static triggers = {
//        // every 2 hours
//        cron name: 'DeleteEmptyGroupsJob',
//                jesqueJobName: DeleteEmptyGroupsJob.simpleName,
//                jesqueQueue: "generic",
//                cronExpression: "0 * * ? * * *",
//                args: []
//    }


	def entryGroupService

	def perform() {
		entryGroupService.doDeleteEmpty()
	}
}
