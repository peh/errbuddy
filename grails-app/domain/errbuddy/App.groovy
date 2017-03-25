package errbuddy

import org.apache.commons.lang.RandomStringUtils
import org.joda.time.DateTime

class App implements HasJsonBody {

	static searchable = {
		except = ['filters', 'entryGroups', 'userAlertSettings', 'deployments']
		root false
	}

	static constraints = {
		apiKey unique: true
		name nullable: false
	}

	static mapping = {
		table 'application'
		deployments sort: 'dateCreated', order: 'DESC'
	}

	static hasMany = [entryGroups: EntryGroup, filters: Filter, deployments: Deployment]

	String name
	String apiKey
	boolean enabled = true
	String appVersion


	DateTime dateCreated, lastUpdated, clearUntil

	Integer getErrorCount() {
		Entry.where { entryGroup.app == this }.count()
	}

	void regenerateApiKey() {
		apiKey = RandomStringUtils.randomAlphanumeric(64)
	}

	def beforeValidate() {
		if (!apiKey)
			regenerateApiKey()
	}

	@Override
	Map getJsonBody() {
		[
			id    : id,
			name  : name,
			apiKey: apiKey,
			errors: errorCount,
			latest: appVersion
		]
	}
}
