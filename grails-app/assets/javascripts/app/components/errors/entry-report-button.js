import React from "react";
var cx = require('classnames');

export default class EntryReportButton extends React.Component {

  render() {
    var classes = cx('btn', 'btn-errbuddy', 'report', 'disabled');
    var text = '';
    if (this.props.withText === true) {
      text = (<span>  Report</span>)
    }
    return (
      <button className={classes} onClick={this.props.onClick}>
        <i className="fa fa-upload"></i>{text}
      </button>
    );
  }

}

// _handleClick: function () {
//   EntryGroupService.resolve(this.props.entryGroup);
// },
