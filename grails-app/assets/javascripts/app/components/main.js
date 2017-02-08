'use strict';

const ReactMiniRouter = require('react-mini-router');
const AppEvents = require('../events/application-events');

// const EntryDetails = require('./entry-groups/entry-details.jsx');
import React from "react";
import MonitoringDetails from "./monitorings/monitoring-details";
import MonitoringAdd from "./monitorings/monitoring-add";
import MonitoringList from "./monitorings/monitoring-list";
import EntryDetails from "./errors/entry-details";
import ErrorList from "./errors/error-list";
import AppSettingsForm from "./application/application-settings";
import ApplicationAdd from "./application/application-add";
import DeploymentList from "./application/deployment-list";
import Navbar from "./navbar/navbar";
import LoginView from "./users/login";
import Sidebar from "./navbar/sidebar";
import UserList from "./users/user-list";
import UserDetails from "./users/user-details";
import ApplicationList from "./application/list";
import _ from "lodash";

const querystring = require('querystring')

window.onerror = function (err, file, line, e) {
  console.log(arguments)
};

var Main = React.createClass({

  mixins: [ReactMiniRouter.RouterMixin],

  getInitialState: function () {
    return {
      currentUser: this.props.currentUser,
      alertMessage: null,
      action: 'login',
      paused: false
    }
  },

  routes: {
    '/errors/': 'errorsWithPage',
    '/errors/:entryGroupId/:entry': 'errorDetails',
    '/': 'errorsWithPage',
    '/login': 'login',
    '/logout': 'logout',
    '/settings/:id/:page*': 'appSettings',
    '/applications/': 'applications',
    '/applications/add': 'addApp',
    '/applications/:id': 'applicationDetails',
    '/users/': 'listUser',
    '/users/add': 'addUser',
    '/users/:id': 'userDetails',
    '/monitorings/add/:type': 'monitoringsAddType',
    '/monitorings/add': 'monitoringsAdd',
    '/monitorings/:id': 'monitoringsDetails',
    '/monitorings': 'monitoringList',
  },

  errorDetails: function (entryGroupId, entryId, page) {
    this.setAction('errors')
    return <EntryDetails entryGroupId={entryGroupId} entryId={entryId} page={this.parsePage(page)} urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  parsePage: function (pageStr) {
    var page = 1;
    if (pageStr && !isNaN(pageStr)) {
      page = parseInt(pageStr);
    }
    return page;
  },

  addApp: function () {
    this.setAction('applications');
    return <ApplicationAdd urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  appSettings: function (id) {
    this.setAction('applications');
    return <AppSettings appId={id} urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  userDetails: function (userId) {
    this.setAction('users');
    return <UserDetails userId={userId} urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  listUser: function () {
    this.setAction('users');
    return <UserList urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  addUser: function () {
    this.setAction('users');
    return <UserDetails urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  errorsWithPage: function () {
    this.setAction('errors');
    return <ErrorList urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app} paused={this.state.paused}/>;
  },

  deployments: function () {
    this.setAction('deployments');
    return <DeploymentList urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  applications: function () {
    this.setAction('applications');
    return <ApplicationList urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  applicationDetails: function (id) {
    this.setAction('applications');
    return <AppSettingsForm appId={parseInt(id)} urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  errors: function () {
    this.setAction('errors');
    return <ErrorList urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  monitoringList: function () {
    this.setAction('monitorings');
    return <MonitoringList urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  monitoringsAdd: function () {
    this.setAction('monitorings');
    return <MonitoringAdd urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  monitoringsAddType: function (type) {
    this.setAction('monitorings');
    if (type !== 'server' && type !== 'service') {
      return ('404');
    }
    return <MonitoringDetails id={-1} type={type} errbuddyApp={this.props.app}/>
  },

  monitoringsDetails: function (id) {
    this.setAction('monitorings');
    return <MonitoringDetails id={this.parsePage(id)} errbuddyApp={this.props.app}/>
  },

  login: function () {
    this.setAction('login');
    return <LoginView onSubmit={this.onUserLoginSubmit} urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
  },

  notFound: function () {
    return (
      <div>Not Found</div>
    );
  },

  getUrlParameters: function () {
    let search = window.location.search;
    if (!search || search.length < 3) {
      return // clearly invalid search
    }
    if (search.indexOf('?') === 0) {
      search = search.substring(1)
    }
    return querystring.parse(search)
  },

  setAction: function (action) {
    if (this.state.action !== action) {
      setTimeout(()=> {
        this.setState(_.assign(this.state, {action: action}))
      }, 500)
    }
  },

  userLoggedIn: function (user) {
    this.setState(_.assign(this.state, {currentUser: user}));
  },

  onUserLoginSubmit: function (username, password) {
    this.getApp().userService.login(username, password)
      .then((user)=> {
        this.userLoggedIn(user);
        setTimeout(()=> {
          this.getApp().navigate('/errors/1')
        }, 200)
      })
      .catch((err)=> {
        throw(err);
      });
  },

  setAlert: function (message) {
    this.setState(_.assign(this.state, {alertMessage: message}));
  },

  hideAlert: function () {
    this.setState(_.assign(this.state, {alertMessage: null}));
  },

  getAlert: function () {
    let alertMessage = this.state.alertMessage;
    if (alertMessage) {
      return (
        <div id="global-alert" className="alert alert-danger">
          <button type="button" onClick={this.hideAlert} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <span className="text">{alertMessage}</span>
        </div>
      )
    } else {
      <div></div>
    }
  },

  setPaused: function (paused) {
    this.setState(_.assign(this.state, {paused}))
  },

  componentDidMount: function () {
    this.getApp().emitter.on(AppEvents.THROW_ERROR, this.setAlert);
    this.getApp().emitter.on(AppEvents.HIDE_ERROR, this.setAlert);
    setTimeout(()=> {
      if (!this.state.currentUser) {
        this.getApp().navigate('/login')
      }
    }, 1000)
  },

  render: function () {
    return (
      <div className="wrap">
        <div className="content">
          <Sidebar
            currentUser={this.state.currentUser}
            urlParameters={this.getUrlParameters()}
            errbuddyApp={this.getApp()}
            action={this.state.action}
            paused={this.state.paused}
            onPauseChange={this.setPaused}/>
          <div className="real-content">
            <header>
              <Navbar currentUser={this.state.currentUser} ref="navbar" urlParameters={this.getUrlParameters()} errbuddyApp={this.getApp()}/>
            </header>
            {this.getAlert()}
            <div className="content-container">
              {this.renderCurrentRoute()}
            </div>
          </div>
        </div>
      </div>
    );
  },

  getApp: function () {
    return this.props.app
  }
});

module.exports = Main;
