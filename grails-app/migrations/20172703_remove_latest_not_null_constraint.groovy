databaseChangeLog = {

	changeSet(author: "peh (generated)", id: "1490609684437-1") {
		dropNotNullConstraint(columnDataType: "bigint", columnName: "latest_id", tableName: "entry_group")
	}
}
