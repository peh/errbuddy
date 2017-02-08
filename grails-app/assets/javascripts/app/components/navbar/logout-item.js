'use strict';

import React from "react";
import UserService from "../../services/user-service";
import BaseComponent from "../tools/base-component";
var NavbarItemText = require('./item-text.jsx');


export default class LogoutItem extends BaseComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <li>
        <a onClick={()=> {
          this.getApp().logout()
        }}>
          <i className="fa fa-power-off"></i><NavbarItemText text="Logout"/>
        </a>
      </li>
    )
  }

}
