import React from "react";
const cx = require('classnames');

export default class Icon extends React.Component {

  render() {
    const {icon, spin} = this.props
    let iconClasses = cx('fa', `fa-${icon}`, {'fa-spin': spin});
    return (
      <div><i className={iconClasses}></i>&nbsp;{this.props.children}</div>
    )
  }

}
