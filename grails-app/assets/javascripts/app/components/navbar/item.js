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
    var classes = cx({
      'danger': this.props.danger === true,
      'active': this.props.currentAction == this.props.action && this.props.danger !== true
    });
    var iconClass = 'fa fa-' + this.props.icon;
    var shouldRender = false;
    if (this.props.roleNeeded) {
      if (this.iHaveRole(this.props.roleNeeded)) {
        shouldRender = true
      }
    } else {
      shouldRender = true
    }
    if (shouldRender) {
      return (
        <li className={classes}>
          <a onClick={this.handleClick}>
            <i className={iconClass}></i><span>{this.props.text}</span>
          </a>
        </li>
      )
    } else {
      return <li></li>;
    }

  }

}
