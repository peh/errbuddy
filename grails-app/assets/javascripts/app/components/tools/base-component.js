import React from "react";
import * as  _ from "lodash";
const AppEvents = require('../../events/application-events');
const querystring = require('querystring');

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);

    if (!props.errbuddyApp) {
      console.error(`${this.constructor.name} was created without the errbuddyApp property`)
      if (!window.errbuddyApp) {
        throw `No errbuddyApp found in window. ${this.constructor.name} will not work`
      }
      props.errbuddyApp = window.errbuddyApp
    }

    // basic setup
    this._paused = false;
    this.interval = -1;

    // bind this to internal methods
    this._bindThis('_handlePauseChanged',
      '_updateMe',
      'setInterval',
      'stopInterval',
      'iHaveRole',
      'iHaveAnyRole',
      'getApp',
      'getMe',
      'getUserService',
      'getApplicationService',
      'getErrorService',
    );

    // signup for events
    props.errbuddyApp.emitter.on(AppEvents.PAUSE_STATE_CHANGED, this._handlePauseChanged)

  }

  updateUrlParameters(params, hash) {
    let url = "";
    if (params) {
      let cleanParams = {};
      _.each(params, (v, k) => {
        if (v !== null && v !== "") {
          cleanParams[k] = v
        }
      });
      url = `${url}?${querystring.stringify(cleanParams)}`
    }
    if (hash) {
      url = `${url}?${hash}`
    }
    history.pushState(null, null, url)
  }

  showError(message) {
    this.getEmitter().emit(AppEvents.THROW_ERROR, message)
  }

  hideError() {
    this.getEmitter().emit(AppEvents.HIDE_ERROR)
  }

  _bindThis() {
    _.each(arguments, (method) => {
      if (this[method] !== undefined) {
        // console.log(`binding ${method} to ${this.constructor.name}`);
        this[method] = this[method].bind(this)
      }
    })
  }

  setInterval(fn, int) {
    this.interval = setInterval(() => {
      this.doInterval(fn)
    }, int)
  }

  doInterval(fn) {
    if (!this.props.paused) {
      fn()
    }
  }

  stopInterval() {
    if (this.interval > 0) {
      clearInterval(this.interval)
    }
  }

  _handlePauseChanged(paused) {
    this._paused = paused;
    if (this.handlePausedChange !== undefined) {
      this.handlePausedChange(paused)
    }
  }

  navigate(target, onylAddressBar) {
    this.getApp().navigate(target, onylAddressBar || false)
  }

  iHaveRole(role) {
    return this.iHaveAnyRole([role])
  }

  getMe() {
    return this.getApp().getCurrentUser();
  }

  iHaveAnyRole(roles) {
    let me = this.getMe()
    if (!me) {
      console.error("iHaveAnyRole was called without any 'me' set");
      return false;
    }
    return _.intersection(me.roles, roles).length > 0
  }

  getApp() {
    return this.props.errbuddyApp;
  }

  getEmitter() {
    return this.getApp().emitter;
  }

  getUserService() {
    return this.getApp().userService;
  }

  getApplicationService() {
    return this.getApp().applicationService;
  }

  getErrorService() {
    return this.getApp().errorService;
  }

  getConfigurationService() {
    return this.getApp().configurationService
  }

  getDeploymentService() {
    return this.getApp().deploymentService
  }

  getMonitoringService() {
    return this.getApp().monitoringService
  }

  showError(message) {
    this.getApp().emitter.emit(AppEvents.THROW_ERROR, message)
  }

  hideError() {
    this.getApp().emitter.emit(AppEvents.HIDE_ERROR)
  }

  getMax() {
    return _.get(this.props.urlParameters, 'max') || 20;
  }

  getOffset() {
    return _.get(this.props.urlParameters, 'offset') || 0;
  }

}
