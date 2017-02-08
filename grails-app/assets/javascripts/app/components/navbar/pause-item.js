import React from "react";
const cx = require('classnames');

export default class TriggerPauseItem extends React.Component {

  render() {
    const {paused} = this.props;
    var classes = cx({
      'fa fa-pause': !paused,
      'fa fa-play': paused
    });
    var text = paused ? 'Resume' : 'Pause';
    return (
      <li >
        <a onClick={this.props.onClick}>
          <i className={classes}></i><span>{text}</span>
        </a>
      </li>
    )
  }

}
