'use strict';

import React from "react";
import BaseComponent from "../tools/base-component";
var cx = require('classnames');
var ReactMiniRouter = require('react-mini-router');

export default class UserListRow extends BaseComponent {

  constructor(props) {
    super(props);
    this._bindThis('rowClicked')

  }

  render() {
    var user = this.props.user;
    var classes = cx({
      'fa fa-check': user.enabled,
      'fa fa-ban': !user.enabled
    });
    return (
      <tr onClick={this.rowClicked}>
        <td>{user.name}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td><i className={classes}> </i></td>
        <td>
          <a href="javascript: void(0)" className="btn btn-sm btn-default" onClick={()=> {
            this.navigate(`/users/${user.id}`)
          }}><i className="fa fa-cog"></i></a>
        </td>
      </tr>
    );
  }

}
