'use strict';

import React from "react";
import BaseComponent from "../tools/base-component.js";
import LoadingHero from "../tools/loading-hero";
import UserListRow from "./user-list-row";
import WithRole from "../tools/with-role";
import Hero from "../tools/hero";
import ReactPaginate from "react-paginate";
import {observer} from "mobx-react/index";
import {observable} from "mobx/lib/mobx";

const ROLES_NEEDED = ['ROLE_ROOT', 'ROLE_ADMIN'];

@observer
export default class UserList extends BaseComponent {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.changePage({selected: 0})
  }

  @observable total = 0;
  @observable max = 20;
  @observable offset = 0;
  @observable users = [];
  @observable loading = false;
  @observable query = "";
  @observable initialized = false;

  async getUserList() {
    this.loading = true;
    try {
      let response = await this.getUserService().list(this.max, this.offset, this.query);
      this.users = response.users;
      this.total = response.total;
      this.loading = false;
      this.initialized = true;

    } catch (e) {
      this.loading = false;
      throw e
    }
  }

  changePage(pageObj) {
    this.offset = pageObj.selected * this.max;
    this.getUserList()
  }

  getUserRows() {
    return this.users.map(user => <UserListRow query={this.query} user={user} key={user.username} errbuddyApp={this.getApp()}/>)
  }

  async onQueryChange(e) {
    this.query = e.target.value;
    this.offset = 0;
    await this.getUserList();
  }

  render() {
    if (!this.initialized) {
      return <LoadingHero />
    }
    return (
      <WithRole user={this.getMe()} roles={ROLES_NEEDED} notAllowed={<section><Hero><h2>You are not allowed to do this!</h2></Hero></section>}>
        <section>
          <input type="search" className="form-control" placeholder="Search" onChange={::this.onQueryChange} value={this.query}/>
          <table className="table table-hover table-condensed">
            <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>email</th>
              <th>enabled</th>
              <th>
                <button
                  className="btn btn-xl btn-success pull-right"
                  onClick={() => {
                    this.navigate('/users/add')
                  }}
                ><i className="fa fa-plus"></i></button>
              </th>
            </tr>
            </thead>
            <tbody>{this.getUserRows()}</tbody>
          </table>
          <ReactPaginate
            pageCount={Math.ceil(this.total / this.max)}
            pageRangeDisplayed={4}
            marginPagesDisplayed={1}
            forceSelected={Math.floor(this.offset / this.max)}
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
