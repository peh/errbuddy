import React from "react";
import _ from "lodash";
var cx = require('classnames');

export default class ValidateableInput extends React.Component {

  render() {
    let {property, bean, label, errors} = this.props
    const type = this.props.type || 'text';
    var placeholder = this.props.placeholder || '';

    let required = this.props.required === true ? 'required' : '';

    var value = bean[property];
    if (this.props.skipValue) {
      value = null
    }

    var hasError = false;

    errors = errors || bean.errors // backwards compatible
    if (errors) {
      let fieldErrors = _.filter(errors, (e)=> {
        return e.field === property
      });
      if (fieldErrors && fieldErrors.length > 0) {
        hasError = true;
      }
    }

    if (!hasError && required === 'required' && !value) {
      hasError = true
    }

    var classes = cx({
      'form-group': true,
      'has-error': hasError
    });
    return (
      <div className={classes}>
        <label htmlFor={property} className="col-sm-2 control-label">{label}</label>

        <div className="col-sm-10">
          <input type={type} className="form-control" id={property} name={property} placeholder={placeholder}
                 value={value || ""} required={required} onChange={this.props.onValueChange}/>
        </div>
      </div>
    )
  }

}
