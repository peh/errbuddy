databaseChangeLog = {

	// ALTER TABLE `entry_group` CHANGE `latest_id` `newest_id` BIGINT(20)  NULL  DEFAULT NULL;
	changeSet(author: "philipp", id: "20170216") {
		renameColumn(tableName: "entry_group", newColumnName: 'latest_id', oldColumnName: 'newest_id', columnDataType: 'bigint' )
    }
}
