package errbuddy

import grails.converters.JSON
import org.joda.time.DateTime

class Entry implements IsFilterable, HasJsonBody {

	long start
	long end
	long runtime

	boolean refindSimilar = false

	String message
	String exception
	EntryLevel entryLevel = EntryLevel.LOG

	String hostname

	String actionName
	String controllerName
	String serviceName
	String path
	String requestParametersJson
	String sessionParametersJson
	String stackTraceJson
	String identifier
	EntryType type

	List stackTrace
	Map requestParameters
	Map sessionParameters

	DateTime dateCreated, lastUpdated, time

	def afterLoad() {
		if (requestParametersJson)
			requestParameters = JSON.parse(requestParametersJson)
		if (sessionParametersJson)
			sessionParameters = JSON.parse(sessionParametersJson)
		if (stackTraceJson)
			stackTrace = JSON.parse(stackTraceJson)
	}

	def beforeValidate() {
		requestParametersJson = (requestParameters ?: [:]) as JSON
		sessionParametersJson = (sessionParameters ?: [:]) as JSON
		stackTraceJson = (stackTrace ?: []) as JSON
		if (!time)
			time = DateTime.now()
	}

	static belongsTo = [entryGroup: EntryGroup]

	static transients = ['requestParameters', 'sessionParameters', 'stackTrace']

	static constraints = {
		stackTrace bindable: true
		sessionParameters bindable: true
		requestParameters bindable: true
		identifier nullable: true
	}

	static mapping = {
		stackTraceJson type: 'text'
		sessionParametersJson type: 'text'
		requestParametersJson type: 'text'
		message type: 'text'
		identifier index: 'identifier_idx'
	}

	static filterFields = ['actionName', 'controllerName', 'serviceName']

	static searchable = {
		except = ['stackTraceJson', 'refindSimilar']
		entryGroup component: 'inner'
	}

	@Override
	Map getJsonBody() {
		[
			id               : id,
			message          : message,
			exception        : exception,
			entryLevel       : entryLevel,
			hostname         : hostname,
			actionName       : actionName,
			controllerName   : controllerName,
			serviceName      : serviceName,
			path             : path,
			stackTrace       : stackTrace,
			requestParameters: requestParameters,
			sessionParameters: sessionParameters,
			time             : time.millis
		]
	}

	public static enum EntryType {
		LOG,
		ERROR,
		PERFORMANCE
	}

	public static enum EntryLevel {

		FATAL(100),
		ERROR(90),
		WARN(80),
		LOG(50)

		int weight

		public EntryLevel(int weight) {
			this.weight = weight
		}

	}
}
