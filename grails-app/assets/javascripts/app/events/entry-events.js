'use strict';

var keyMirror = require('keymirror');

var EntryEvents = keyMirror({
  SEARCH_QUERY_CHANGED: null,
  ENTRY_RESOLVED: null,
  ENTRY_DELETED: null,
  SELECTION_CHANGED: null
});

module.exports = EntryEvents;
