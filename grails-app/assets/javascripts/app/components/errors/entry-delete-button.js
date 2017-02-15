import React from "react";
const cx = require('classnames');

export default class EntryDeleteButton extends React.Component {

  render() {
    var classes = cx('btn', 'btn-errbuddy', 'delete');
    return (
      <button className={classes} onClick={this.props.onClick}>
        <i className="fa fa-trash"></i> Delete
      </button>
    );
  }

}
