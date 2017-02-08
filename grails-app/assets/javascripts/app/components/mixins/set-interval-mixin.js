'use strict';

var AppEvents = require('../../events/application-events')

var SetIntervalMixin = {

  componentWillMount: function () {
    this.interval = -1;
  },

  setInterval: function () {
    this.interval = setInterval.apply(null, arguments)
  },

  componentWillUnmount: function () {
    this.stopInterval()
  },

  stopInterval: function () {
    if (this.interval > 0) {
      clearInterval(this.interval)
    }
  }
};

module.exports = SetIntervalMixin;
