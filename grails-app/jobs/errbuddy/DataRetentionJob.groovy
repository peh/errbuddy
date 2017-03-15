package errbuddy

class DataRetentionJob {

	static triggers = {
		cron name: 'DataRetentionJob',
			jesqueJobName: DataRetentionJob.simpleName,
			jesqueQueue: "generic",
			cronExpression: "0 /5 * ? * * *",
			args: []
	}

	def dataRetentionService

	def perform(long id = 0) {
		if (id) {
			dataRetentionService.handleDataRetentionForApplication(id)
		} else {
			App.createCriteria().list {
				eq('enabled', true)
				projections { property('id') }
			}.each { long appId ->
				dataRetentionService.handleDataRetentionForApplication(appId)
			}
		}
	}
}
