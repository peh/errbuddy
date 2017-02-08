package errbuddy

import org.joda.time.DateTime

class Monitoring implements HasJsonBody {

	String hostname
	String url
	String name

	int averageResponseTime

	boolean enabled
	Status status

	DateTime dateCreated
	DateTime lastUpdated
	DateTime lastChecked
	DateTime lastSuccess

	Type type

	MonitoringCheck latestCheck

	static hasMany = [checks: MonitoringCheck]

	@Override
	Map getJsonBody() {
		[
			id                 : id,
			name               : name,
			hostname           : hostname,
			url                : url,
			enabled            : enabled,
			type               : type?.name(),
			status             : status ? status.name() : Status.BLUE.name(),
			averageResponseTime: averageResponseTime,
			lastChecked        : lastChecked?.millis,
			lastSuccess        : lastSuccess?.millis
		]
	}

	public static enum Type {
		SERVER,
		SERVICE
	}

	public static enum Status {
		BLUE, // no checks have ever been performed
		GREEN, // none of the last 20 checks have failed
		YELLOW, // at least one, but not the latest check failed
		RED // at least the latest check failed
	}

	static constraints = {
		hostname unique: true, nullable: true
		url unique: true, nullable: true
		lastChecked nullable: true
		lastSuccess nullable: true
		latestCheck nullable: true
		status nullable: true
	}

	public getLatestChecks() {
		MonitoringCheck.findAllByMonitoring(this, [max: 20, sort: 'dateCreated', order: 'desc'])
	}
}
