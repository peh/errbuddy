'use strict';

var AppEvents = require('../../events/application-events');

var CanThrowErrorMixin = {

  componentWillUnmount: function () {
    this._hideError();
  },

  _showError: function (message) {
    emitter.emit(AppEvents.THROW_ERROR, message)
  },

  _hideError: function () {
    emitter.emit(AppEvents.HIDE_ERROR)
  }
};

module.exports = CanThrowErrorMixin;
