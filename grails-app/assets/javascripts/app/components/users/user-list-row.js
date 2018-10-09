'use strict';

import React from "react";
import BaseComponent from "../tools/base-component";
import Highlighter from "react-highlight-words";

var cx = require('classnames');

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
      <tr>
        <td>
          <Highlighter
            highlightClassName="query-match"
            searchWords={[this.props.query]}
            autoEscape={true}
            textToHighlight={user.name}
          />
        </td>
        <td>
          <Highlighter
            highlightClassName="query-match"
            searchWords={[this.props.query]}
            autoEscape={true}
            textToHighlight={user.username}
          />
        </td>
        <td>
          <Highlighter
            highlightClassName="query-match"
            searchWords={[this.props.query]}
            autoEscape={true}
            textToHighlight={user.email}
          />
        </td>
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
