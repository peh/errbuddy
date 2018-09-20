'use strict';

import React from "react";
import BaseComponent from "../tools/base-component.js";
import LoadingHero from "../tools/loading-hero";
import UserListRow from "./user-list-row";
import WithRole from "../tools/with-role";
import Hero from "../tools/hero";
import ReactPaginate from "react-paginate";

const ROLES_NEEDED = ['ROLE_ROOT', 'ROLE_ADMIN'];
export default class UserList extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      total: 0,
      max: 20,
      offset: 0
    };

    this._bindThis('getUserList');
    setTimeout(this.getUserList, 1000)
  }

  getUserList() {
    let {max, offset} = this.state;
    this.getUserService().list(max, offset)
      .then((response) => {
        let {users, total} = response;
        this.setState({...this.state, users: users, total: total})
      })
      .catch((err) => {
        throw(err)
      })
  }

  changePage(pageObj) {
    let offset = pageObj.selected * this.state.max;
    this.setState({...this.state, offset: offset}, () => {
      this.getUserList()
    });
  }

  render() {
    if (this.state.users.length === 0) {
      return <LoadingHero />
    }
    var rows = [];
    const {total, max, offset} = this.state;
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
          <ReactPaginate
            pageCount={Math.ceil(total / max)}
            pageRangeDisplayed={4}
            marginPagesDisplayed={1}
            forceSelected={Math.floor(offset / max)}
            onPageChange={::this.changePage}
            previousLabel="&laquo;"
            nextLabel="&raquo;"
            breakLabel={<a href="">...</a>}
            activeClassName="active"
            containerClassName="pagination"
          />
        </section>
      </WithRole>
    );
  }

}
