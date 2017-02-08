package errbuddy

import grails.transaction.Transactional

@Transactional
class FilterService {

	def grailsApplication

	List<String> getFieldNames(String clazzName) {
		def clazz = grailsApplication.getDomainClass("errbuddy.$clazzName")
		if (clazz && clazz.clazz in IsFilterable)
			clazz.clazz.filterFields
		else
			null
	}

	List<FilterItem> createFilterItemsFromParameterMap(map) {
		List<FilterItem> result = []
		def values = map.getList('value')
		def operands = map.getList("operand")
		def fields = map.getList("field")
		def filterItemTypes = map.getList("filterItemType")
		if (values && operands && fields)
			map.getList('value').eachWithIndex { v, i ->
				FilterItem.Operand operand = FilterItem.Operand.valueOf(operands[i])
				FilterItem.FilterItemType filterItemType = FilterItem.FilterItemType.valueOf(filterItemTypes[i])
				def field = fields[i]
				result << new FilterItem(value: v, operand: operand, field: field, filterItemType: filterItemType)
			}
		result
	}

	void clearFilterItems(Filter filter) {
		def items = []
		items.addAll(filter.filterItems)
		items.each {
			filter.removeFromFilterItems(it)
			// bug in Mongo plugin, we need to delete this by hand now
			it.delete()
		}
	}

	def getFilterResults(Filter filter, def params = [:]) {
		params.sort = 'time'
		params.order = 'desc'
		Entry.createCriteria().list(params) {
			if (params.last) {
				gt('time', params.getLong('last'))
			}
			eq('app', filter.app)
			and {
				filter.ands.each {
					switch (it.operand) {
						case FilterItem.Operand.EQ: eq(it.field, it.value)
					}
				}
			}
			or {
				filter.ors.each {
					switch (it.operand) {
						case FilterItem.Operand.EQ: eq(it.field, it.value)
					}
				}
			}
		}
	}
}
