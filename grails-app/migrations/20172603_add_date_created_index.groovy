databaseChangeLog = {

	changeSet(author: "philipp", id: "20172603") {
		preConditions(onFail: "MARK_RAN") {
			indexExists(name: "date_created")
		}
		createIndex(tableName: "entry", indexName: "date_created") {
			column(name: "date_created")
		}
	}
}
