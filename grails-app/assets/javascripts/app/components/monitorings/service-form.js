'use strict';

import React from "react";
import SubmitButton from "../tools/submit-button";
var cx = require('classnames');

export default class ServiceForm extends React.Component {

  onInputValueChanged(e) {
    let target = e.target
    let field = target.getAttribute('name');
    let value = target.value;
    if (target.type === 'checkbox') {
      value = target.checked
    }
    this.props.onValueChange(field, value)
  }

  render() {
    var errors = this.props.errors;
    var hasErorrs = typeof errors !== 'undefined' && errors && errors.length > 0;
    var classes = cx({
      'disabled': !this.props.dirty,
      'btn-success': this.props.saved && !hasErorrs,
      'btn-danger': this.props.saved && hasErorrs,
      'shake': this.props.saved && hasErorrs,
      'freez': this.props.saved && hasErorrs,
      'shake-rotate': this.props.saved && hasErorrs
    });
    return (
      <form onSubmit={this.props.onSave} className="form-horizontal">
        <div className="form-group">
          <label htmlFor="name" className="col-sm-2 control-label">Name</label>

          <div className="col-sm-10">
            <input type="text" name="name" className="form-control" value={this.props.service.name} onChange={this.onInputValueChanged} required="required"/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="hostname" className="col-sm-2 control-label">Hostname</label>
          <div className="col-sm-10">
            <input type="url" name="url" className="form-control" value={this.props.service.url} onChange={this.onInputValueChanged} required="required"/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <div className="checkbox">
              <label>
                <input name="enabled" type="checkbox" onChange={this.onInputValueChanged} checked={this.props.service.enabled}/>
                Enabled
              </label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <SubmitButton classes={classes}/>
            &nbsp;
            <button type="submit" className="btn btn-danger btn-sm" onClick={this.props.onDelete}>
              <i className="fa fa-trash"></i>
              &nbsp;Delete
            </button>
          </div>
        </div>
      </form>
    );
  }

}
