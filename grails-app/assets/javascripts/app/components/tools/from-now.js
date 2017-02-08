const moment = require('moment');
import React from "react";

export default class FromNow extends React.Component {

  render() {
    return (
      <span>{moment(this.props.time).fromNow()}</span>
    )
  }

}
