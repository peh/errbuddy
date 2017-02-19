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
    var hasErorrs = typeof errors !== 'undefined' && errors && errors.length > 0;
    var classes = cx({
      'btn': true,
      'btn-default': true,
      'disabled': !this.state.application.dirty,
      'btn-success': this.state.saved && !hasErorrs,
      'btn-danger': this.state.saved && hasErorrs,
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
          <form method="POST" onSubmit={this.onFormSubmit}>
            <div className="group">
              <label htmlFor="name">Name</label>
              <div className="inputs">
                <input type="text" name="name" id="name" className="form-control" onChange={(e) => {
                  this.onValueChange('name', e.target.value)
                }} required="required"/>
              </div>
            </div>
            <div className="group">
              <div className="inputs">
                <button type="submit" className={classes}>
                  <i className="fa fa-floppy-o"></i> Save
                </button>
              </div>
            </div>
            {/*<div className="form-group">*/}
            {/*<div className="col-sm-offset-2 col-sm-10">*/}
            {/*</div>*/}
            {/*</div>*/}
          </form>
        </div>
      </section>
    );
  }

}
