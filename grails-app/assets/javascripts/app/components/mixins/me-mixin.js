'use strict';

var AppEvents = require('../../events/application-events');
var UserEvents = require('../../events/user-events');

var MeMixin = {

  _me: null,

  componentWillMount: function () {
    let userService = this.props.App.userService;
    this._me = userService.getCurrentUser();
    this.props.App.emitter.on(AppEvents.LOGGED_IN, function (me) {
      this._me = me;
    }.bind(this));

    this.props.App.emitter.on(AppEvents.LOGIN_VALIDATED, function (me) {
      this._me = me;
    }.bind(this));
    this.props.App.emitter.on(UserEvents.ME_UDPATED, function (me) {
      this._me = me;
    }.bind(this));
  },

  iHaveRole: function (role) {
    if (this._me === null) {
      return false;
    } else {
      return this._me.roles.indexOf(role) >= 0
    }
  }

};
module.exports = MeMixin;
