'use strict';
import React from "react";
import LoadingHero from "../tools/loading-hero";
import BaseComponent from "../tools/base-component.js";
import * as  _ from "lodash";
import DeploymentList from "./deployment-list";
import WithRole from "../tools/with-role";
var cx = require('classnames');
var swal = require('sweetalert');

class AppSettingsForm extends BaseComponent {

  constructor(props) {
    super(props)
  }

  render() {
    let {application, onValueChange, onFormSubmit, saved} = this.props

    var hasErorrs = typeof errors !== 'undefined' && errors && errors.length > 0;
    var classes = cx('success', {
      'danger': saved && hasErorrs,
      'shake': saved && hasErorrs,
      'freez': saved && hasErorrs,
      'shake-rotate': saved && hasErorrs
    });
    return (
      <WithRole user={this.getMe()} roles={['ROLE_ADMIN', 'ROLE_ROOT']} notAllowed="You are not Allowed to access this page!">
        <form onSubmit={onFormSubmit}>
          <div className="group">
            <input type="text" name="name" id="name" value={application.name} onChange={(e) => {
              onValueChange('name', e.target.value)
            }} required="required"/>
            <label htmlFor="name">Name</label>
          </div>
          <div className="group">
            <input type="text" value={application.apiKey} readOnly={true} onClick={(e) => {
              e.target.select()
            }}/>
            <label htmlFor="apiKey">ApiKey</label >
          </div>
          <div className="group">
            <div className="buttons">
              <button type="submit" className={classes} disabled={!application.dirty}>
                <span><i className="fa fa-floppy-o"></i > Save</span>
              </button>
              <button onClick={this.props.onDelete} className="danger">
                <span><i className="fa fa-trash"></i > Delete</span>
              </button>
              <button onClick={this.props.onClear} className="warning">
                <span><i className="fa fa-eraser"></i > Clear</span>
              </button>
            </div>
          </div>
        </form>
      </WithRole>
    )
  }
}

export default class AppSettingsView extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      originalApplication: null,
      application: null,
      saved: false
    };

    this._bindThis('_onFormSubmit', '_onValueChange', '_onDelete', '_onClear');

    this.getApplicationService().get(props.appId).then(response => {
      this.updateState({application: response.application, errorCount: response.errorCount, originalApplication: response.application, saved: false});
    }).catch((err) => {
      this.showError("Could not get Application information from server");
      throw err
    });
  }

  _onFormSubmit(e) {
    e.preventDefault();
    if (this.state.application.dirty) {
      this.getApplicationService().save(this.state.application)
        .then(response => {
          let application = response.application;
          this.updateState({application, originalApplication: application, saved: true})
        })
        .catch((e) => {
          debugger;
        })
    }
  }

  _onValueChange(field, value) {
    let application = _.assign({}, this.state.application);
    application[field] = value;
    application.dirty = true;
    this.updateState({application, saved: false});
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
    let app = this.state.application;
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
          this.showError("Something went wrong while cleaning that application");
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
          <h3>{this.state.originalApplication.name || 'Add Application'}&nbsp;<small>({this.state.errorCount} Entries)</small>
          </h3>
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
        <DeploymentList application={this.state.application} errbuddyApp={this.props.errbuddyApp} urlParameters={this.props.urlParameters}/>
      </section>
    )
  }
}
