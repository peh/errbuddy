import React from "react";
import _ from "lodash";
const cx = require('classnames');

export default class ServerForm extends React.Component {

  constructor(props) {
    super(props)

    this.onInputValueChanged = this.onInputValueChanged.bind(this)
  }

  onInputValueChanged(e) {
    let target = e.target
    let field = target.getAttribute('name');
    let value = target.value;
    if (target.type === 'checkbox') {
      value = target.checked
    }
    this.props
      .onValueChange(field, value)
  }

  render() {
    var errors = this.props.errors;
    var hasErorrs = typeof errors !== 'undefined' && errors && errors.length > 0;
    var classes = cx({
      'btn': true,
      'btn-default': true,
      'disabled': !this.props.dirty,
      'btn-success': this.props.saved && !hasErorrs,
      'btn-warning': hasErorrs,
      'shake': hasErorrs,
      'freez': hasErorrs,
      'shake-rotate': hasErorrs
    });
    var hostnameClasses = cx('form-group', {
      'has-error': _.find(errors, (error)=> {
        return error.field === 'hostname'
      }) !== undefined
    })
    return (
      <form onSubmit={this.props.onSave} className="form-horizontal">
        <div className="form-group">
          <label htmlFor="name" className="col-sm-2 control-label">Name</label>

          <div className="col-sm-10">
            <input type="text" name="name" className="form-control" value={this.props.server.name || ""} onChange={this.onInputValueChanged} required="required"/>
          </div>
        </div>
        <div className={hostnameClasses}>
          <label htmlFor="hostname" className="col-sm-2 control-label">Hostname</label>

          <div className="col-sm-10">
            <input type="text" name="hostname" className="form-control" value={this.props.server.hostname || ""} onChange={this.onInputValueChanged} required="required"/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <div className="checkbox">
              <label>
                <input name="enabled" type="checkbox" onChange={this.onInputValueChanged} checked={this.props.server.enabled || false}/>
                Enabled
              </label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button type="submit" className={classes}>
              <i className="fa fa-floppy-o"></i>
              Save
            </button>

            <button type="submit" className="btn btn-danger btn-sm" onClick={this.props.onDelete}>
              <i className="fa fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </form>
    );
  }

}
