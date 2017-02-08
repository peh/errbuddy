package errbuddy

import grails.converters.JSON

class JsonUtil {

	static String asString(Map map) {
		(map as JSON).toString()
	}

	static Map fromString(String json) {
		JSON.parse(json) as Map
	}
}
