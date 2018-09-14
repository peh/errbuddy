dataSource {
	dbCreate = "none" // sql-migration plugin will do that for us!
	driverClassName = "com.mysql.jdbc.Driver"
	url = "jdbc:mysql://127.0.0.1/errbuddy?generateSimpleParameterMetadata=true&zeroDateTimeBehavior=convertToNull"
	username = "errbuddy"
	password = "123456"
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
			timeout = 2000
			usePool = true
		}
	}
}

grails {
	serverURL = System.getProperty('errbuddy.serverUrl')
	redis {
		host = redisHost
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
	retentionDays = 21
}

grails {
	jesque {
		enabled = true
		schedulerThreadActive = false
		delayedJobThreadActive = true
	}
	plugin {
		errbuddy {
			enabled = true // whether the plugin is enabled and the LogAppender is registered with the root logger
			exceptionsOnly = false // whether to send more then just exceptions
			threshold = "WARN" // if exceptionsOnly is false, this is the threshold
			hostname {
				resolve = false
				name = 'localhost'
			}
		}
	}
}

elasticSearch {
	client {
		mode = 'transport'
		hosts = [
			[
				host: "127.0.0.1",
				port: 9300
			]
		]
	}
	datastoreImpl = 'hibernateDatastore'
	cluster.name = 'elasticsearch'
	bulkIndexOnStartup = false
}
