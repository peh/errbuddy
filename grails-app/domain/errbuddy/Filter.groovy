package errbuddy

import org.joda.time.DateTime

class Filter {

	static belongsTo = [app: App]
	static hasMany = [filterItems: FilterItem]

	String name

	DateTime dateCreated, lastUpdated

	static constraints = {
	}

	static mapping = {
		filterItems cascade: 'all-delete-orphan'
	}

	def getAnds() {
		filterItems.findAll {
			it.filterItemType == FilterItem.FilterItemType.AND
		}
	}

	def getOrs() {
		filterItems.findAll {
			it.filterItemType == FilterItem.FilterItemType.OR
		}
	}
}
