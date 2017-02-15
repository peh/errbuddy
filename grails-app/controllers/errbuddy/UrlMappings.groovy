class UrlMappings {

	static mappings = {
		"500"(view: '/error')

		"/s/$identifier"(controller: 'site', action: 'byIdentifier')

		// AppApi
		'/api/app/me'(controller: 'user', action: 'me')
		"/api/app/users/$id"(controller: 'user', action: [GET: 'get', PUT: 'update', DELETE: 'delete'])
		"/api/app/users/$id/roles"(controller: 'user', action: 'roles')
		"/api/app/users"(controller: 'user', action: [POST: 'create', GET: 'list'])

		"/api/app/monitorings"(controller: 'monitoring', action: [POST: 'create', GET: 'list'])
		"/api/app/monitorings/$id"(controller: 'monitoring', action: [GET: 'get', PUT: 'update', DELETE: 'delete'])
		"/api/app/monitorings/$id/checks"(controller: 'monitoring', action: [GET: 'checks'])

		"/api/app/monitorings/stats"(controller: 'monitoring', action: 'stats')

		"/api/app/entries/$id/$entry"(controller: 'entryGroup', action: [GET: 'get', DELETE: 'delete'])

		"/api/app/entries/$id"(controller: 'entryGroup', action: [DELETE: 'delete'])
		"/api/app/entries/$id/resolve"(controller: 'entryGroup', action: 'resolve')
		"/api/app/entries/$id/similar"(controller: 'entryGroup', action: 'similar')
		"/api/app/entries/$id/refind"(controller: 'entryGroup', action: 'refind')
		"/api/app/entries/$id/histogram"(controller: 'entryGroup', action: 'histogram')

		"/api/app/entries"(controller: 'entryGroup', action: 'list')

		"/api/app/test"(controller: 'appApiEntry', action: 'test')

		"/api/app/applications"(controller: 'application', action: [GET: "list", POST: "add"])

		"/api/app/applications/$id"(controller: 'application', action: [GET: "details", PUT: "update", DELETE: "delete"])
		"/api/app/applications/$id/clear"(controller: 'application', action: 'clear')
		"/api/app/applications/$appId/deployments"(controller: 'deployment', action: [GET: "list", DELETE: "delete"])

		"/api/app/settings/reindex"(controller: 'settings', action: [POST: "reindex"])

		"/api/app/filter/$id"(controller: 'appFilter', action: 'execute')

		// Admin

		"/admin/jesque/"(controller: 'jesqueAdmin', action: 'index')
		"/admin/jesque/api/overview"(controller: 'jesqueAdmin', action: 'overview')
		"/admin/jesque/api/queues"(controller: 'jesqueAdminQueue', action: 'list')
		"/admin/jesque/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'details', method: "GET")
		"/admin/jesque/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'remove', method: "DELETE")
		"/admin/jesque/api/jobs"(controller: 'jesqueAdminStatistics', action: 'jobs', method: "GET")
		"/admin/jesque/api/jobs"(controller: 'jesqueAdminJob', action: 'enqueue', method: "POST")
		"/admin/jesque/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'failed', method: "GET")
		"/admin/jesque/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'clear', method: "DELETE")
		"/admin/jesque/api/jobs/delayed"(controller: 'jesqueAdminJob', action: 'delayed', method: "GET")
		"/admin/jesque/api/jobs/triggers"(controller: 'jesqueAdminJob', action: 'triggers', method: "GET")
		"/admin/jesque/api/jobs/triggers/$name"(controller: 'jesqueAdminJob', action: 'deleteTrigger', method: "DELETE")
		"/admin/jesque/api/jobs/$job"(controller: 'jesqueAdminStatistics', action: 'list', method: "GET")
		"/admin/jesque/api/workers"(controller: 'jesqueAdminWorker', action: 'list', method: 'GET')
		"/admin/jesque/api/workers"(controller: 'jesqueAdminWorker', action: 'manual', method: 'POST')

		// Api
		"/api/error"(controller: 'api', action: 'handle')
		"/api/deployment"(controller: 'api', action: 'deploy')
		"/api/deployment/latest"(controller: 'api', action: 'latest')
		"/api/ping"(controller: 'api', action: 'ping')

		"/s/$identifier"(controller: 'shortlink', action: 'redirect')

		// everything goes to "the app"
		"/**"(view: "/page/app")
	}
}
