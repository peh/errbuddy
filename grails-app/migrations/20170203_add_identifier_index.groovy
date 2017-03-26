databaseChangeLog = {

	changeSet(author: "philipp", id: "20170203") {
		preConditions(onFail: "MARK_RAN") {
			indexExists(name: "identifier")
		}
		createIndex(tableName: "entry", indexName: "identifier") {
			column(name: "identifier")
		}
	}
}
