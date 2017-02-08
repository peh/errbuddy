'use strict';

var ServerEvents = require('../events/server-events');

var ApplicationService = {

  list: function (app, listParams, success) {
    var params = {sort: 'name', order: 'asc'}
    params.offset = listParams.offset || 0
    params.max = listParams.max || 20
    params.showDisabled = listParams.showDisabled || false

    superagent.get(window.App.baseUrl + '/api/app/' + app.id + '/servers')
      .set('Content-Type', 'application/json')
      .query(params)
      .end(function (err, response) {
        if (response.status === 200) {
          success(response.body);
        }
      }.bind(this));
  },

  get: function (entryGroupId, entryId, successCallback, errorCallback) {
    superagent.get(window.App.baseUrl + this.PATH + entryGroupId + '/' + entryId)
      .end(function (err, response) {
        if (response.status === 200) {
          successCallback(response.body);
        } else {
          errorCallback(err, response);
        }
      });
  },

  del: function (entryGroup, errorCallback) {
    superagent.del(window.App.baseUrl + this.PATH + entryGroup.entryGroupId)
      .set('Content-Type', 'application/json')
      .end(function (err, response) {
        if (response.status === 200) {
          emitter.emit(ServerEvents.DELETED, entryGroup);
        } else if (errorCallback) {
          errorCallback(response);
        }
      }.bind(this));
  },

};

module.exports = ApplicationService;
