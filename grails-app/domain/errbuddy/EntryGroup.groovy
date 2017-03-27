package errbuddy

import org.apache.commons.lang.RandomStringUtils
import org.joda.time.DateTime

class EntryGroup implements HasJsonBody {

	static searchable = {
		except = ['entries', 'resolvedBy']
		root false
		app component: 'inner'
	}

	static belongsTo = [app: App]
	static hasMany = [entries: Entry]

	String issueUrl
	String entryGroupId
	boolean collector
	boolean confirmed
	boolean resolved
	boolean deleted

	long entryCount = 0
	Entry latest = null

	User resolvedBy

	DateTime lastUpdated, dateCreated
	DateTime resolveDate

	def afterLoad() {
		if (!entryCount)
			entryCount = Entry.countByEntryGroup(this)
		if (!latest) {
			latest = Entry.findByEntryGroup(this, [order: 'desc', sort: 'time'])
		}
	}

	static constraints = {
		entryGroupId unique: true
		issueUrl nullable: true
		resolveDate nullable: true
		resolvedBy nullable: true
		latest nullable: true
	}

	def beforeValidate() {
		if (!entryGroupId)
			entryGroupId = RandomStringUtils.randomAlphanumeric(32)
	}

	@Override
	Map getJsonBody() {
		def latestEntry = [:]
		if (latest) {
			latestEntry.id = latest.id
			latestEntry.exception = latest.exception ?: latest.message
			latestEntry.message = latest.exception ? latest.message : (latest.stackTrace ? latest.stackTrace.first() : null)
		}
		[
			id          : id,
			entryGroupId: entryGroupId,
			entries     : entryCount,
			latest      : latestEntry,
			dateCreated : dateCreated.millis,
			lastUpdated : lastUpdated.millis,
			resolved    : resolved,
			resolvedBy  : resolvedBy?.email,
			resolveDate : resolveDate?.millis,
			confirmed   : confirmed,
			application : appId
		]
	}
}
