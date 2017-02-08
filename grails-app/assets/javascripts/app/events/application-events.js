'use strict';

var keyMirror = require('keymirror');

var AppEvents = keyMirror({
  APP_STARTED: null,
  APPLICATION_LIST_UPDATED: null,
  APPLICATION_UPDATED: null,
  APPLICATION_CREATED: null,
  LOGGED_OUT: null,
  LOGGED_IN: null,
  LOGIN_VALIDATED: null,
  SELECTED_APP_CHANGED: null,
  PAUSE_STATE_CHANGED: null,
  PAGE_CHANGED: null,
  ACTION_CHANGED: null,
  THROW_ERROR: null,
  HIDE_ERROR: null
});

module.exports = AppEvents;
