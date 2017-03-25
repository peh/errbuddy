databaseChangeLog = {

	changeSet(author: "philipp", id: "20172503-1", comment: 'drop FK constraints') {
		dropAllForeignKeyConstraints(baseTableName: "monitoring")
		dropAllForeignKeyConstraints(baseTableName: "monitoring_check")
		dropIndex(tableName: 'monitoring', indexName: 'FK_cp7it2rk9ohbnykrq0hnqd2ei')
	}

	changeSet(author: "philipp", id: "20172503-2", comment: 'drop monitoring check table') {
		dropTable(tableName: 'monitoring_check')
	}

	changeSet(author: "philipp", id: "20172503-3", comment: 'drop application monitoring mapping table') {
		dropTable(tableName: 'application_monitoring')
	}

	changeSet(author: "philipp", id: "20172503-4", comment: 'drop monitoring table') {
		dropTable(tableName: 'monitoring')
	}

}
