package errbuddy

import grails.transaction.Transactional
import org.springframework.http.HttpStatus

@Transactional(readOnly = true)
class EntryGroupController extends AbstractApiController {

	static allowedMethods = [list: ['GET'], delete: 'DELETE']

	@Transactional
	def resolve() {
		withEntryGroup(params.id.toString()) { EntryGroup entryGroup ->
			def ret = entryGroupService.resolve(entryGroup, currentUser)
			renderJson([success: true, entryGroup: ret])
		}
	}

	def refind() {
		withEntryGroup(params.id.toString()) { EntryGroup entryGroup ->
			entryGroupService.startRefind(entryGroup)
			renderJson([success: true])
		}
	}

	def delete() {
		withEntryGroup(params.id.toString()) { EntryGroup entryGroup ->
			entryGroupService.deleteGroup(entryGroup)
			renderJson([success: true])
		}
	}

	def list() {
		sanitizeParams()

		def total = 0
		def list = []

		def applications
		if (params.applications) {
			applications = App.findAllByIdInList(params.getList('applications').collect { it as Long })
		} else {
			applications = App.list()
		}

		if (params.query) {
			def groups = entryGroupService.search("$params.query", applications)
			if (groups) {
				list = EntryGroup.createCriteria().list(params) {
					inList('id', groups)
					eq('collector', false)
					eq('resolved', false)
					order('lastUpdated', 'desc')
					isNotNull('newest')
				}
				total = list.totalCount
			}
		} else {
			list = EntryGroup.createCriteria().list(params) {
				inList('app', applications)
				eq('collector', false)
				eq('resolved', false)
				order('lastUpdated', 'desc')
				isNotNull('newest')
			}
			total = list.totalCount
		}
		renderJson([result: list, total: total])
	}

	def histogram() {
		withEntryGroup(params.id.toString()) { EntryGroup entryGroup ->
			renderJson([data: entryGroupService.getEntryGroupHistogram(entryGroup)])
		}
	}

	def get() {
		sanitizeParams()
		params.order = params.order ?: 'desc'
		params.sort = params.sort ?: 'time'

		def resp = [:]
		// we are checking EntryGroup and Entry here.
		withEntryGroup(params.id.toString()) { EntryGroup entryGroup ->
			withEntry(params.getLong("entry")) { Entry entry ->
				if (entry.entryGroup == entryGroup) {
					resp =[
						entryGroup: entryGroup,
						entry     : entry
					]
				} else {
					response.status = HttpStatus.BAD_REQUEST.value()
				}
			}
		}
		renderJson(resp)
	}

	def similar() {
		sanitizeParams()
		params.order = params.order ?: 'desc'
		params.sort = params.sort ?: 'time'

		// we are checking EntryGroup and Entry here.
		withEntryGroup(params.id.toString()) { EntryGroup entryGroup ->
			Entry entry = null
			if (params.entry) {
				entry = Entry.read(params.getLong("entry"))
			}
			def similar = entryGroupService.paginatedEntries(entryGroup, params, entry)
			renderJson([
				similar: similar,
				total  : similar.totalCount
			])
		}
	}

}
