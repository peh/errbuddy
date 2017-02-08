const moment = require('moment');
import React from "react";

export default class FormatedDate extends React.Component {

  render() {
    var $moment = moment(this.props.time);
    var text = $moment.format(this.props.format || 'LLL');
    if (this.props.withFrom) {
      text += ' (' + $moment.fromNow() + ')';
    }

    return (
      <span>{text}</span>
    );
  }

}
