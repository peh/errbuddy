'use strict';

var AppEvents = require('../../events/application-events');
var HandlesPauseStateMixin = {

  _paused: true,

  _handlePauseChanged: function (paused) {
    this._paused = paused;
    if (this.handlePausedChange !== undefined) {
      this.handlePausedChange(paused)
    }
  },

  componentDidMount: function () {
    emitter.on(AppEvents.PAUSE_STATE_CHANGED, this._handlePauseChanged)
  },

  componentWillUnmount: function () {
    emitter.removeListener(AppEvents.PAUSE_STATE_CHANGED, this._handlePauseChanged)
  }

};

module.exports = HandlesPauseStateMixin;
