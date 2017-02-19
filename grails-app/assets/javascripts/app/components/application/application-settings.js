'use strict';
import React from "react";
import LoadingHero from "../tools/loading-hero";
import BaseComponent from "../tools/base-component.js";
import * as  _ from "lodash";
import DeploymentList from "./deployment-list";
var ApplicationService = require('../../services/application-service');
var cx = require('classnames');
var swal = require('sweetalert');

class AppSettingsForm extends BaseComponent {

  constructor(props) {
    super(props)
  }

  render() {
    if (this.iHaveRole('ROLE_ADMIN') || this.iHaveRole('ROLE_ROOT')) {
      let {application, onValueChange, onFormSubmit, saved} = this.props

      var hasErorrs = typeof errors !== 'undefined' && errors && errors.length > 0;
      var classes = cx({
        'btn': true,
        'btn-default': true,
        'disabled': !application.dirty,
        'btn-success': saved && !hasErorrs,
        'btn-danger': saved && hasErorrs,
        'shake': saved && hasErorrs,
        'freez': saved && hasErorrs,
        'shake-rotate': saved && hasErorrs
      });
      return (
        <form onSubmit={onFormSubmit}>
          <div className="group">
            <label htmlFor="name" className="col-sm-2 control-label">Name</label>
            <div className="inputs">
              <input type="text" name="name" id="name" value={application.name} onChange={(e) => {
                onValueChange('name', e.target.value)
              }} required="required"/>
            </div>
          </div>
          <div className="group">
            <label htmlFor="apiKey" className="col-sm-2 control-label">ApiKey</label >
            <div className="inputs">
              <input type="text" value={application.apiKey} readOnly={true}/>
            </div>
          </div>
          <div className="group">
            <div className="inputs">
              <button type="submit" className={classes}>
                <i className="fa fa-floppy-o"></i > Save
              </button>
              <button onClick={this.props.onDelete} className="btn btn-danger">
                <i className="fa fa-trash"></i > Delete
              </button>
              <button onClick={this.props.onClear} className="btn btn-warning">
                <i className="fa fa-trash"></i > Clear
              </button>
            </div>
          </div>
        </form>
      )
    }
    else {
      return <div></div>
    }
  }
}

export default class AppSettingsView extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      application: null,
      saved: false
    };

    this._bindThis('_onFormSubmit', '_onValueChange', '_onDelete', '_onClear');

    this.getApplicationService().get(props.appId).then((response) => {
      this.setState(_.assign(this.state, {application: response.application, saved: false}));
    }).catch((err) => {
      this.showError("Could not get Application information from server")
      throw err
    });
  }

  _onFormSubmit(e) {
    e.preventDefault();
    if (this.state.application.dirty) {
      this.getApplicationService().save(this.state.application, () => {
        this.setState(_.assign(this.state, {saved: true}))
      }, (response) => {
        let state = this.state;
        let app = state.application
        app.errors = response.errors;
        this.setState(_.assign(this.state, {applicaiton: app}))
      });
    }
  }

  _onValueChange(field, value) {
    let app = _.assign(this.state.application)
    app[field] = value;
    app.dirty = true;
    this.setState(_.assign(this.state, {application: app}));
  }

  _onDelete() {
    let app = this.state.application
    swal({
      title: 'You are about to delete ' + this.state.application.name,
      text: 'This cannot be undone!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No!',
      closeOnConfirm: false
    }, () => {
      this.getApplicationService().del(app).then(() => {
        swal({
          title: 'Success',
          text: 'We started a Job that will delete all the data of this App.',
          type: 'success'
        }, () => {
          this.navigate('/applications');
        })
      }).catch((err) => {
        this.showError('Could not delete Application');
        throw err
      });
    });
  }

  _onClear() {
    let app = this.state.application
    swal({
      title: 'You are about to clear ' + app.name,
      text: 'This cannot be undone!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No!',
      closeOnConfirm: false
    }, () => {
      this.getApplicationService().clear(app)
        .then(() => {
          swal({
            title: 'Success',
            text: 'We started a Job that will delete all the data that was gathered until NOW.',
            type: 'success'
          })
        })
        .catch((err) => {
          this.showError("Something went wrong while cleaning that application")
          throw(err)
        });
    });
  }

  render() {
    if (!this.state.application) {
      return <LoadingHero />
    }
    return (
      <section>
        <div className="page-header">
          <h3>{this.state.application.name || 'Add Application'}</h3>
        </div>
        <AppSettingsForm
          errbuddyApp={this.props.errbuddyApp}
          application={this.state.application}
          onValueChange={this._onValueChange}
          onFormSubmit={this._onFormSubmit}
          onDelete={this._onDelete}
          onClear={this._onClear}
          saved={this.state.saved}
        />
        <DeploymentList application={this.state.application} errbuddyApp={this.props.errbuddyApp}/>
      </section>
    )
  }
}
