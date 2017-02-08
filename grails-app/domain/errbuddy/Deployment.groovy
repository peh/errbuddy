package errbuddy

import org.joda.time.DateTime

class Deployment implements HasJsonBody {

	static belongsTo = [app: App]

	String versionString
	String hostname

	DateTime dateCreated

	static constraints = {
	}

	@Override
	Map getJsonBody() {
		[
			id           : id,
			versionString: versionString,
			hostname     : hostname,
			dateCreated  : dateCreated.millis
		]
	}
}
