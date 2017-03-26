'use strict';

import React from "react";
import BaseComponent from "../tools/base-component";
const cx = require('classnames');


export default class NavItem extends BaseComponent {
  constructor(props) {
    super(props);
    this._bindThis('handleClick')
  }

  handleClick() {
    this.navigate(this.props.path)
  }

  render() {
    const {currentAction, action, roleNeeded, icon, text} = this.props;
    let classes = cx("item", {
      'active': currentAction === action
    });
    let iconClass = 'fa fa-' + icon;
    let shouldRender = false;
    if (roleNeeded) {
      let role = roleNeeded;
      if (!Array.isArray(role))
        role = [role];
      if (this.iHaveAnyRole(role)) {
        shouldRender = true
      }
    } else {
      shouldRender = true
    }
    if (shouldRender) {
      return (
        <a onClick={this.handleClick} className={classes}>
          <i className={iconClass}></i>&nbsp;{text}
        </a>
      )
    } else {
      return <div></div>;
    }

  }

}
