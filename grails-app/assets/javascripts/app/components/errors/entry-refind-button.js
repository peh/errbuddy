const cx = require('classnames');
import React from "react";

export default class EntryRefindButton extends React.Component {

  render() {
    var classes = cx('btn-warning', 'btn', {
      'btn-sm': this.props.small
    }, {
      'btn-lg': this.props.large
    });
    return (
      <button className={classes} onClick={this.props.handleClick}>
        <i className="fa fa-undo fa-2x"></i>
      </button>
    );
  }

}

