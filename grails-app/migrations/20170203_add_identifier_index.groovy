databaseChangeLog = {

	changeSet(author: "philipp", id: "20170216") {
		createIndex(tableName: "entry", indexName: "identifier_idx") {
			column(name: "identifier")
		}
	}
}
