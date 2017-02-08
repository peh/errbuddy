'use strict';

var keyMirror = require('keymirror');

var MonitoringEvents = keyMirror({
  MONITORING_DELETED: null,
  MONITORING_UPDATED: null,
  MONITORING_CREATED: null,
  MONITORING_SAVE_FAILED: null,
  MONITORING_STATS_UPDATED: null
});

module.exports = MonitoringEvents;
