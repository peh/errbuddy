import React from "react";
import ReactDom from "react-dom";
import * as AppEvents from "./events/application-events";
import UserService from "./services/user-service";
import ApplicationService from "./services/application-service";
import ErrorService from "./services/error-service";
import ConfigurationService from "./services/configuration-service";
import DeploymentService from "./services/deployment-service";
import MonitoringService from "./services/monitoring-service";
import SettingsService from "./services/settings-service";

const EventEmitter = require('events').EventEmitter;
const LocalStore = require('./tools/local-storage');
const ReactMiniRouter = require('react-mini-router');
const Main = require('./components/main');
const querystring = require('querystring');

export default class App {
  constructor() {

    this.baseUrl = window.upstream;
    this.showRefind = LocalStore.get('errbuddy.refind.show') === 'true';
    this.action = null;
    this.paused = false;

    this.userSettings = {
      list: {
        max: 10
      },
      showRefind: false
    };

    this._me = null
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(0);

    this.userService = new UserService(this.emitter, this.baseUrl);
    this.applicationService = new ApplicationService(this.emitter, this.baseUrl);
    this.errorService = new ErrorService(this.emitter, this.baseUrl);
    this.deploymentService = new DeploymentService(this.emitter, this.baseUrl);
    this.monitoringService = new MonitoringService(this.emitter, this.baseUrl);
    this.settingsService = new SettingsService(this.emitter, this.baseUrl);

    this.configurationService = new ConfigurationService();

    this.emitter.on(AppEvents.PAUSE_STATE_CHANGED, (paused)=> {
      this.paused = paused;
    });

    this.emitter.on(AppEvents.ACTION_CHANGED, (paused)=> {
      setTimeout(()=> {
        this.emitter.emit(AppEvents.PAUSE_STATE_CHANGED, App.paused)
      }, 500);
    })

    window.onerror = function(message, url, lineNumber) {
      console.log(arguments)
    };
  }

  getCurrentUser() {
    return this._me
  }

  start() {
    this.userService.validate().then((user)=> {
      this._me = user;
      this._doStart(user)
    }).catch(()=> {
      this._doStart(null)
    })
  }

  _doStart(user) {
    console.log(`starting app with logged in user: ${user ? user.name : 'null'}`)
    window.errbuddyApp = this;
    ReactDom.render(<Main history={true} app={this} currentUser={user}/>, document.getElementById('app-body'));
    LocalStore.set('errbuddy.user.lastSearch', null);
    this.emitter.emit(AppEvents.APP_STARTED)
  }

  navigate(path, updateUrlOnly, query) {
    if(query) {
      path = `${path}?${querystring.stringify(query)}`
    }
    ReactMiniRouter.navigate(path, updateUrlOnly)
  }

  logout() {
    this.userService.logout().then(()=> {
      this.navigate('/login');
      setTimeout(()=> {
        window.location.reload()
      }, 500)
    })
  }
}
