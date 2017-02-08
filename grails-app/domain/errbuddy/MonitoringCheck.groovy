package errbuddy

import org.joda.time.DateTime

class MonitoringCheck implements HasJsonBody {

	int responseTime
	int responseCode
	boolean okay

	DateTime dateCreated

	static belongsTo = [monitoring: Monitoring]

	@Override
	Map getJsonBody() {
		[
			id          : id,
			responseTime: responseTime,
			responseCode: responseCode,
			okay        : okay,
			dateCreated : dateCreated.millis
		]
	}
}
