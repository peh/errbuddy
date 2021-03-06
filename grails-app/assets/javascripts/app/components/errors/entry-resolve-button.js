const cx = require('classnames');
import React from "react";

export default class EntryResolveButton extends React.Component {

  render() {
    var classes = cx('btn', 'btn-errbuddy', 'resolve', {
      'disabled': this.props.entryGroup.resolved
    });
    return (
      <button className={classes} onClick={this.props.onClick}>
        <i className="fa fa-check"></i> Resolve
      </button>
    );
  }

}
// _handleClick: function () {
//   EntryGroupService.resolve(this.props.entryGroup);
// },
