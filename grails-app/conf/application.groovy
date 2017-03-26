import errbuddy.*
import grails.plugins.jesque.admin.JesqueJobStatisticsCollectingWorkerImpl
import net.greghaines.jesque.worker.LoggingWorkerListener

// Added by the Spring Security Core plugin:
grails.plugin.springsecurity.password.algorithm = 'bcrypt'
grails.plugin.springsecurity.userLookup.userDomainClassName = 'errbuddy.User'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'errbuddy.UserRole'
grails.plugin.springsecurity.authority.className = 'errbuddy.Role'
grails.plugin.springsecurity.rejectIfNoRule = false
grails.plugin.springsecurity.fii.rejectPublicInvocations = false
grails.plugin.springsecurity.logout.postOnly = false
grails.plugin.springsecurity.securityConfigType = "InterceptUrlMap"
grails.plugin.springsecurity.interceptUrlMap = [
	[pattern: '/jesqueManager/**', access: ['ROLE_ROOT']],
	[pattern: '/**', access: ['permitAll']],
	[pattern: '/**/js/**', access: ['permitAll']],
	[pattern: '/**/css/**', access: ['permitAll']],
	[pattern: '/**/images/**', access: ['permitAll']],
	[pattern: '/**/font/**', access: ['permitAll']],
	[pattern: '/**/favicon.ico', access: ['permitAll']]
]
grails.plugin.springsecurity.rest.login.endpointUrl = '/api/app/login'
grails.plugin.springsecurity.rest.logout.endpointUrl = '/api/app/logout'
grails.plugin.springsecurity.rest.token.validation.endpointUrl = '/api/app/validate'
grails.plugin.springsecurity.rest.token.storage.useJwt = false
grails.plugin.springsecurity.rest.token.storage.redis.expiration = 8640000

grails.plugin.springsecurity.filterChain.chainMap = [
	//Stateless chain
	[
		pattern: '/api/app/**',
		filters: 'JOINED_FILTERS,-anonymousAuthenticationFilter,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter,-rememberMeAuthenticationFilter'
	],

	//Traditional chain
	[
		pattern: '/**',
		filters: 'JOINED_FILTERS,-restTokenValidationFilter,-restExceptionTranslationFilter'
	]
]

grails.gorm.default.constraints = {
	'*'(nullable: true)
}

grails.gorm.default.mapping = {
	"user-type" type: org.jadira.usertype.dateandtime.joda.PersistentDateTime, class: org.joda.time.DateTime
	"user-type" type: org.jadira.usertype.dateandtime.joda.PersistentLocalDate, class: org.joda.time.LocalDate
}

boolean isPuttingIntoGroup = Boolean.parseBoolean(System.getProperty('errbuddy.skipPutWorker', 'true'))

def putJobs = [
	ApplicationDeleteJob,
	EntryPutJob,
	EntryDeleteJob
]
def genericJobs = [
	ApplicationDeploymentJob,
	DeleteEntryGroupJob,
	FindSimilarEntriesJob,
	ReindexJob
]

def dbHeavyJobs = [
	DeleteEmptyGroupsJob,
	RefindFromCollectorJob,
	DataRetentionJob
]

grails {
	redis {
		poolConfig {
			// jedis pool specific tweaks here, see jedis docs & src
			testWhileIdle = true
			maxTotal = 500
		}
		timeout = 2000 //default in milliseconds
	}
	jesque {
		enabled = true
		pruneWorkersOnStartup = true
		createWorkersOnStartup = true
		schedulerThreadActive = true
		delayedJobThreadActive = true
		autoFlush = true
		statistics {
			enabled = true
			max = 1000
		}
		custom {
			worker.clazz = JesqueJobStatisticsCollectingWorkerImpl
			listener.clazz = LoggingWorkerListener
		}
		workers {
			if (isPuttingIntoGroup) {
				// this should only be done by ONE worker (app wide) as we will run into concurrency issues otherwise
				// it's a fairly simple and quick task so it one is enough for hundreds of put's per second
				AddToGroupPool {
					workers = 1
					queueNames = PutIntoEntryGroupJob.queueName
					jobTypes = [PutIntoEntryGroupJob.name]
				}
			}
			PutPool {
				workers = 2
				queueNames = putJobs.collect { it.queueName }.unique()
				jobTypes = putJobs.name
			}
			GenericPool {
				workers = 3
				queueNames = genericJobs.collect { it.queueName }.unique()
				jobTypes = genericJobs.name
			}
			DBHeavyPool {
				workers = 1
				queueNames = dbHeavyJobs.collect { it.queueName }.unique()
				jobTypes = dbHeavyJobs.name
			}
		}
	}
	plugin {
		databasemigration {
			updateOnStart = true
		}
	}
}
