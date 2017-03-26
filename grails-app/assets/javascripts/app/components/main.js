'use strict';

const ReactMiniRouter = require('react-mini-router');
const AppEvents = require('../events/application-events');
// const EntryDetails = require('./entry-groups/entry-details.jsx');
import React from "react";
import Nav from "./navbar/index";
import AppSettings from "./settings/settings";
import EntryDetails from "./errors/entry-details";
import ErrorList from "./errors/error-list";
import AppSettingsForm from "./application/application-settings";
import ApplicationAdd from "./application/application-add";
import DeploymentList from "./application/deployment-list";
import LoginView from "./users/login";
import UserList from "./users/user-list";
import UserDetails from "./users/user-details";
import ApplicationList from "./application/list";
import * as  _ from "lodash";

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
    '/errors/': 'redirectToErrors',
    '/errors/:id': 'redirectToErrors',
    '/errors/:entryGroupId/:entry': 'errorDetails',
    '/': 'errorsWithPage',
    '/login': 'login',
    '/logout': 'logout',
    '/settings/': 'appSettings',
    '/applications/': 'applications',
    '/applications/add': 'addApp',
    '/applications/:id': 'applicationDetails',
    '/users/': 'listUser',
    '/users/add': 'addUser',
    '/users/:id': 'userDetails'
  },


  redirectToErrors() {
    setTimeout(() => {
      this.props.app.navigate('/')
    }, 500);
    return (<div>Redirecting</div>)
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
    this.setAction('settings');
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

  login: function () {
    this.setAction('login');
    return <LoginView onUserLoggedIn={this.userLoggedIn} urlParameters={this.getUrlParameters()} errbuddyApp={this.props.app}/>;
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
      setTimeout(() => {
        this.setState(_.assign(this.state, {action: action}))
      }, 500)
    }
  },

  userLoggedIn: function (user) {
    this.getApp().setCurrentUser(user);
    this.setState(_.assign({}, this.state, {currentUser: user}), () => {
      this.getApp().navigate("/")
    })

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
    setTimeout(() => {
      if (!this.state.currentUser) {
        this.getApp().navigate('/login')
      }
    }, 1000)
  },

  render: function () {
    return (
      <div className="errbuddy-container">

        <Nav
          errbuddyApp={this.getApp()}
          urlParameters={this.getUrlParameters()}
          action={this.state.action}
          paused={this.state.paused}
          onPauseChange={this.setPaused}
        />
        <div className="body">
          {this.renderCurrentRoute()}
        </div>
      </div>
    );
    // {/*<div className="errbuddy-container">*/}
    //   {/*<div className="sidebar-wrap">*/}
    //     {/*<Sidebar*/}
    //       {/*currentUser={this.state.currentUser}*/}
    //       {/*urlParameters={this.getUrlParameters()}*/}
    //       {/*errbuddyApp={this.getApp()}*/}
    //     {/*/>*/}
    //   {/*</div>*/}
    //   {/*<div className="content">*/}
    //     {/*<header>*/}
    //       {/*<Navbar currentUser={this.state.currentUser} ref="navbar" urlParameters={this.getUrlParameters()} errbuddyApp={this.getApp()}/>*/}
    //     {/*</header>*/}
    //     {/*{this.getAlert()}*/}
    //     {/*<div className="content-container">*/}
    //       {/*{this.renderCurrentRoute()}*/}
    //     {/*</div>*/}
    //   {/*</div>*/}
    // {/*</div>*/}
  },

  getApp: function () {
    return this.props.app
  }
});

module.exports = Main;
