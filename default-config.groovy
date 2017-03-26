String mysqlHost = System.getProperty('errbuddy.mysql.host') ?: "mariadb"
String mysqlDatabase = System.getProperty('errbuddy.mysql.database') ?: "errbuddy"
String mysqlUser = System.getProperty('errbuddy.mysql.user') ?: "errbuddy"
String mysqlPassword = System.getProperty('errbuddy.mysql.password') ?: "123456"
String redisHost = System.getProperty('errbuddy.redis.host') ?: "redis"
String redisPort = System.getProperty('errbuddy.redis.port') ?: "6379"
String elasticsearchHost = System.getProperty('errbuddy.elasticsearch.host') ?: "elasticsearch"
String elasticsearchPort = System.getProperty('errbuddy.elasticsearch.port') ?: "9300"

println "########################################################################"
println "# Mysql Configuration:"
println "#  host: $mysqlHost"
println "#  db  : $mysqlDatabase"
println "#  user: $mysqlUser"
println "# Redis Configuration:"
println "#  host: $redisHost"
println "#  port: $redisPort"
println "# Elasticsearch Configuration:"
println "#  host: $elasticsearchHost"
println "#  port: $elasticsearchPort"
println "########################################################################"

dataSource {
	dbCreate = "none" // sql-migration plugin will do that for us!
	driverClassName = "com.mysql.jdbc.Driver"
	url = "jdbc:mysql://${mysqlHost}/${mysqlDatabase}?generateSimpleParameterMetadata=true&zeroDateTimeBehavior=convertToNull"
	username = mysqlUser
	password = mysqlPassword
	properties {
		maxActive = 100
		minEvictableIdleTimeMillis = 1800000
		timeBetweenEvictionRunsMillis = 1800000
		numTestsPerEvictionRun = 3
		testOnBorrow = true
		testWhileIdle = true
		testOnReturn = true
		validationQuery = "SELECT 1"
	}
}

springsession {
	redis {
		connectionFactory {
			host = redisHost
			port = Integer.parseInt(redisPort)
			timeout = 2000
			usePool = true
			dbIndex = 5
		}
	}
}

grails {
	serverURL = System.getProperty('errbuddy.serverUrl')
	redis {
		host = redisHost
		port = Integer.parseInt(redisPort)
		poolConfig {
			// jedis pool specific tweaks here, see jedis docs & src
			testWhileIdle = true
			maxTotal = 500
		}
		timeout = 2000 //default in milliseconds
	}
}

errbuddy {
	defaultMax = 20
	maximumMax = 100
	supportedLanguages = ['en']
	defaultLanguage = 'en'
	retentionDays = 90
}

elasticSearch {
	client {
		mode = 'transport'
		hosts = [
			[
				host: elasticsearchHost,
				port: Integer.parseInt(elasticsearchPort)
			]
		]
	}
	datastoreImpl = 'hibernateDatastore'
	cluster.name = 'elasticsearch'
	bulkIndexOnStartup = false
}

grails {
	plugin {
		errbuddy {
			enabled = false
			host = System.getProperty('errbuddy.serverUrl')
			apiKey = "9hSsjixHbPI64bjgwkUPXrxVXfpitxM6f9ZRyT06OGdxjDumNhD4gemO3cN6vDr"
			exceptionsOnly = false
		}
	}
}
