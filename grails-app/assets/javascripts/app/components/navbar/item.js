'use strict';

import React from "react";
import BaseComponent from "../tools/base-component";
const cx = require('classnames');


export default class NavbarItem extends BaseComponent {
  constructor(props) {
    super(props)

    this._bindThis('handleClick')
  }

  handleClick() {
    this.navigate(this.props.path)
  }

  render() {
    const {danger, currentAction, action, roleNeeded, icon, text} = this.props;
    var classes = cx({
      'danger': danger === true,
      'active': currentAction == action && danger !== true
    });
    var iconClass = 'fa fa-' + icon;
    var shouldRender = false;
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
        <li className={classes}>
          <a onClick={this.handleClick}>
            <i className={iconClass}></i><span>{text}</span>
          </a>
        </li>
      )
    } else {
      return <li></li>;
    }

  }

}
