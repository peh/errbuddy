'use strict';

var cx = require('classnames');
import BaseComponent from "../tools/base-component";
import React from "react";
import * as  _ from "lodash";

export default class ApplicationAdd extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      application: {
        errors: []
      },
      saved: false
    }

    this._bindThis('onValueChange', 'onFormSubmit')
  }

  onFormSubmit(e) {
    e.preventDefault();
    if (this.state.application.dirty) {
      this.getApplicationService().save(this.state.application).then((resp) => {
        this.navigate((`/applications/${resp.application.id}`))
      }).catch((err) => {
        this.showError("Could not save Application")
        throw err
      })
    }
  }

  componentDidMount() {
    if (!this.iHaveAnyRole(['ROLE_ADMIN', 'ROLE_ROOT'])) {
      this.navigate('/errors')
    }
  }

  saveErrorCallback(jqXHR) {
    if (jqXHR.status == 400) {
      let app = this.state.application
      app.errors = jqXHR.responseJSON.errors;
      this.setState(_.assign(this.state, {application: app}))
    }
  }

  onValueChange(f, v) {
    let app = _.assign(this.state.application)
    app[f] = v;
    app.dirty = true;
    this.setState(_.assign(this.state, {
      application: app,
      saved: false
    }));
  }

  render() {
    const hasErorrs = typeof errors !== 'undefined' && errors && errors.length > 0;
    const classes = cx({
      'success': true,
      'shake': this.state.saved && hasErorrs,
      'freez': this.state.saved && hasErorrs,
      'shake-rotate': this.state.saved && hasErorrs
    });

    return (
      <section>
        <div className="page-header">
          <h3>Add Application</h3>
        </div>
        <div>
          <form onSubmit={this.onFormSubmit}>
            <div className="group">
              <input type="text" name="name" id="name" onChange={(e) => {
                this.onValueChange('name', e.target.value)
              }} required="required"/>
              <label htmlFor="name">Name</label>
            </div>
            <div className="group">
              <div className="buttons">
                <button type="submit" className={classes} disabled={!this.state.application.dirty}>
                  <span><i className="fa fa-floppy-o"></i> Save</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  }

}
