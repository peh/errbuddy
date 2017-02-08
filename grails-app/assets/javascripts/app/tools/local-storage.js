'use strict';

var LocalStore = {
  get: function (key) {
    return localStorage.getItem(key);
  },
  set: function (key, value) {
    return localStorage.setItem(key, value);
  },
  getBoolean: function (key) {
    var fromStore = this.get(key);
    if (fromStore == undefined) {
      return false
    } else {
      return (fromStore === 'true')
    }
  },

  getInt: function (key) {
    var fromStore = this.get(key);

    if (fromStore == undefined || isNaN(fromStore)) {
      return 0
    } else {
      return parseInt(fromStore)
    }
  },

  KEY_NOTIFICATION_ALLOWED: 'notificationEnabled',
  DEFAULT_LIST_SIZE_KEY: 'defaultListSize',
  SHOW_REFIND_BUTTON: 'showRefindButtons',
  SELECTED_APP: 'selectedApp'

};

module.exports = LocalStore;
