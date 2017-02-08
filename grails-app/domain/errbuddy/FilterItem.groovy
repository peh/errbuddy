package errbuddy

import grails.converters.JSON
import org.joda.time.DateTime

class FilterItem {

	static belongsTo = [filter: Filter]

	String field
	Operand operand
	def value
	String valueJson
	FilterItemType filterItemType

	DateTime dateCreated, lastUpdated

	def afterLoad() {
		if (valueJson)
			value = JSON.parse(valueJson)?.value
	}

	def beforeInsert() {
		valueJson = [value: (value ?: [:])] as JSON
	}

	public static enum Operand {
		EQ,
		IN,
		GT,
		LT
	}

	public static enum FilterItemType {
		AND,
		OR
	}

	static constraints = {
		value bindable: true
	}
}
