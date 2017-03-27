databaseChangeLog = {

	changeSet(author: "philipp", id: "20172703-2") {
		preConditions(onFail: "MARK_RAN") {
			indexExists(name: "refind_similar")
		}
		createIndex(tableName: "entry", indexName: "refind_similar") {
			column(name: "date_created")
		}
	}
}
