'use strict';

import React from "react";
import BaseComponent from "../tools/base-component.js";
import LoadingHero from "../tools/loading-hero";
import UserListRow from "./user-list-row";
import WithRole from "../tools/with-role";
import Hero from "../tools/hero";

const ROLES_NEEDED = ['ROLE_ROOT', 'ROLE_ADMIN'];
export default class UserList extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {users: []};

    this._bindThis('getUserList');
    setTimeout(this.getUserList, 1000)
  }

  getUserList() {
    this.getUserService().list(50, 0)
      .then((response) => {
        this.setState({users: response.users})
      })
      .catch((err) => {
        throw(err)
      })
  }

  render() {
    if (this.state.users.length === 0) {
      return <LoadingHero />
    }
    var rows = [];
    this.state.users.forEach((user) => {
      rows.push(<UserListRow user={user} key={user.username} errbuddyApp={this.getApp()}/>);
    });
    return (
      <WithRole user={this.getMe()} roles={ROLES_NEEDED} notAllowed={<section><Hero><h2>You are not allowed to do this!</h2></Hero></section>}>
        <section>
          <table className="table table-hover table-condensed">
            <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>email</th>
              <th>enabled</th>
              <th>
                <button className="btn btn-xl btn-success pull-right" onClick={() => {
                  this.navigate('/users/add')
                }}><i className="fa fa-plus"></i></button>
              </th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </section>
      </WithRole>
    );
  }

}
