databaseChangeLog = {

    changeSet(author: "philipp (generated)", id: "1473668840252-1") {
        createTable(tableName: "application") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "applicationPK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "api_key", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "app_version", type: "VARCHAR(255)")

            column(name: "clear_until", type: "datetime")

            column(name: "date_created", type: "datetime")

            column(name: "enabled", type: "BOOLEAN")

            column(name: "last_updated", type: "datetime")

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-2") {
        createTable(tableName: "application_monitoring") {
            column(name: "app_monitorings_id", type: "BIGINT")

            column(name: "monitoring_id", type: "BIGINT")
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-3") {
        createTable(tableName: "deployment") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "deploymentPK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "app_id", type: "BIGINT")

            column(name: "date_created", type: "datetime")

            column(name: "hostname", type: "VARCHAR(255)")

            column(name: "version_string", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-4") {
        createTable(tableName: "entry") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "entryPK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "action_name", type: "VARCHAR(255)")

            column(name: "controller_name", type: "VARCHAR(255)")

            column(name: "date_created", type: "datetime")

            column(name: "end", type: "BIGINT")

            column(name: "entry_group_id", type: "BIGINT")

            column(name: "entry_level", type: "VARCHAR(255)")

            column(name: "exception", type: "VARCHAR(255)")

            column(name: "hostname", type: "VARCHAR(255)")

            column(name: "identifier", type: "VARCHAR(255)")

            column(name: "last_updated", type: "datetime")

            column(name: "message", type: "CLOB") {
                constraints(nullable: "false")
            }

            column(name: "path", type: "VARCHAR(255)")

            column(name: "refind_similar", type: "BOOLEAN")

            column(name: "request_parameters_json", type: "CLOB") {
                constraints(nullable: "false")
            }

            column(name: "runtime", type: "BIGINT")

            column(name: "service_name", type: "VARCHAR(255)")

            column(name: "session_parameters_json", type: "CLOB") {
                constraints(nullable: "false")
            }

            column(name: "stack_trace_json", type: "CLOB") {
                constraints(nullable: "false")
            }

            column(name: "start", type: "BIGINT")

            column(name: "time", type: "datetime")

            column(name: "type", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-5") {
        createTable(tableName: "entry_group") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "entry_groupPK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "app_id", type: "BIGINT")

            column(name: "collector", type: "BOOLEAN")

            column(name: "confirmed", type: "BOOLEAN")

            column(name: "date_created", type: "datetime")

            column(name: "deleted", type: "BOOLEAN")

            column(name: "entry_count", type: "BIGINT")

            column(name: "entry_group_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "issue_url", type: "VARCHAR(255)")

            column(name: "last_updated", type: "datetime")

            column(name: "newest_id", type: "BIGINT")

            column(name: "resolve_date", type: "datetime")

            column(name: "resolved", type: "BOOLEAN")

            column(name: "resolved_by_id", type: "BIGINT")
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-6") {
        createTable(tableName: "filter") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "filterPK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "app_id", type: "BIGINT")

            column(name: "date_created", type: "datetime")

            column(name: "last_updated", type: "datetime")

            column(name: "name", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-7") {
        createTable(tableName: "filter_item") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "filter_itemPK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "date_created", type: "datetime")

            column(name: "field", type: "VARCHAR(255)")

            column(name: "filter_id", type: "BIGINT")

            column(name: "filter_item_type", type: "VARCHAR(255)")

            column(name: "last_updated", type: "datetime")

            column(name: "operand", type: "VARCHAR(255)")

            column(name: "value_json", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-8") {
        createTable(tableName: "monitoring") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "monitoringPK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "average_response_time", type: "INT")

            column(name: "date_created", type: "datetime")

            column(name: "enabled", type: "BOOLEAN")

            column(name: "hostname", type: "VARCHAR(255)")

            column(name: "last_checked", type: "datetime")

            column(name: "last_success", type: "datetime")

            column(name: "last_updated", type: "datetime")

            column(name: "latest_check_id", type: "BIGINT")

            column(name: "name", type: "VARCHAR(255)")

            column(name: "status", type: "VARCHAR(255)")

            column(name: "type", type: "VARCHAR(255)")

            column(name: "url", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-9") {
        createTable(tableName: "monitoring_check") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "monitoring_checkPK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "date_created", type: "datetime")

            column(name: "monitoring_id", type: "BIGINT")

            column(name: "okay", type: "BOOLEAN")

            column(name: "response_code", type: "INT")

            column(name: "response_time", type: "INT")
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-10") {
        createTable(tableName: "role") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "rolePK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "authority", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-11") {
        createTable(tableName: "user") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "userPK")
            }

            column(name: "version", type: "BIGINT")

            column(name: "account_expired", type: "BOOLEAN")

            column(name: "account_locked", type: "BOOLEAN")

            column(name: "date_created", type: "datetime")

            column(name: "email", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "enabled", type: "BOOLEAN")

            column(name: "force_password_change", type: "BOOLEAN")

            column(name: "last_updated", type: "datetime")

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "password", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "password_expired", type: "BOOLEAN")

            column(name: "username", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-12") {
        createTable(tableName: "user_role") {
            column(name: "role_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "user_id", type: "BIGINT")
        }
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-13") {
        addPrimaryKey(columnNames: "role_id, user_id", constraintName: "user_rolePK", tableName: "user_role")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-14") {
        addUniqueConstraint(columnNames: "api_key", constraintName: "UC_APPLICATIONAPI_KEY_COL", tableName: "application")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-15") {
        addUniqueConstraint(columnNames: "entry_group_id", constraintName: "UC_ENTRY_GROUPENTRY_GROUP_ID_COL", tableName: "entry_group")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-16") {
        addUniqueConstraint(columnNames: "hostname", constraintName: "UC_MONITORINGHOSTNAME_COL", tableName: "monitoring")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-17") {
        addUniqueConstraint(columnNames: "url", constraintName: "UC_MONITORINGURL_COL", tableName: "monitoring")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-18") {
        addUniqueConstraint(columnNames: "authority", constraintName: "UC_ROLEAUTHORITY_COL", tableName: "role")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-19") {
        addUniqueConstraint(columnNames: "email", constraintName: "UC_USEREMAIL_COL", tableName: "user")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-20") {
        addUniqueConstraint(columnNames: "username", constraintName: "UC_USERUSERNAME_COL", tableName: "user")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-21") {
        addForeignKeyConstraint(baseColumnNames: "entry_group_id", baseTableName: "entry", constraintName: "FK_1tuc0ibn2o1b1ht7frrqf7fg", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "entry_group")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-22") {
        addForeignKeyConstraint(baseColumnNames: "monitoring_id", baseTableName: "monitoring_check", constraintName: "FK_249796uusxepa4ekacrprqpwt", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "monitoring")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-23") {
        addForeignKeyConstraint(baseColumnNames: "resolved_by_id", baseTableName: "entry_group", constraintName: "FK_33g19tgd3t188hmnax7uopc9x", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-24") {
        addForeignKeyConstraint(baseColumnNames: "newest_id", baseTableName: "entry_group", constraintName: "FK_4xf90hepc6urjjygda294xv7m", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "entry")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-25") {
        addForeignKeyConstraint(baseColumnNames: "app_id", baseTableName: "deployment", constraintName: "FK_8i87fhycmwnlyn5jmw9xvhgc7", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "application")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-26") {
        addForeignKeyConstraint(baseColumnNames: "monitoring_id", baseTableName: "application_monitoring", constraintName: "FK_8n2ltor443jb3go6uc1eokhn5", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "monitoring")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-27") {
        addForeignKeyConstraint(baseColumnNames: "app_id", baseTableName: "entry_group", constraintName: "FK_8q673y2kel4qmlwkjrc3ubdis", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "application")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-28") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_role", constraintName: "FK_apcc8lxk2xnug8377fatvbn04", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-29") {
        addForeignKeyConstraint(baseColumnNames: "latest_check_id", baseTableName: "monitoring", constraintName: "FK_cp7it2rk9ohbnykrq0hnqd2ei", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "monitoring_check")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-30") {
        addForeignKeyConstraint(baseColumnNames: "app_id", baseTableName: "filter", constraintName: "FK_e0v3eip8f0apvq4fldfx2p06s", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "application")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-31") {
        addForeignKeyConstraint(baseColumnNames: "app_monitorings_id", baseTableName: "application_monitoring", constraintName: "FK_egf34ocxmhbgfsiuodtcesrwj", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "application")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-32") {
        addForeignKeyConstraint(baseColumnNames: "filter_id", baseTableName: "filter_item", constraintName: "FK_fatffliepi299y1ar0a8pot0y", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "filter")
    }

    changeSet(author: "philipp (generated)", id: "1473668840252-33") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "user_role", constraintName: "FK_it77eq964jhfqtu54081ebtio", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role")
    }
}
