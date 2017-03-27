databaseChangeLog = {

	include file: '20160912_initial.groovy'
	include file: '20171602_rename_newest.groovy'
	include file: '20170203_add_identifier_index.groovy'
	include file: '20172503_drop_monitoring.groovy'
	include file: '20172603_add_date_created_index.groovy'
	include file: '20172703_remove_latest_not_null_constraint.groovy'
}
