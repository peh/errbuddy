import React from "react";
import BaseComponent from "../tools/base-component";
import * as querystring from "querystring";
const cx = require('classnames');

export default class NavbarSearchForm extends BaseComponent {
  constructor(props) {
    super(props);

    let params = props.urlParameters || {};
    this.state = {
      query: params.query || ""
    };

    this._bindThis('handleFormSubmit', 'onValueChange', 'doSearch')
  }

  handleFormSubmit(e) {
    this.navigate(`/?${querystring.stringify({offset: 0, query: this.state.query})}`);
    e.preventDefault();
  }

  onValueChange(e) {
    this.updateState({query: e.target.value})
  }

  render() {
    const placeHolder = 'use * as a wildcard and combine terms with AND / OR';
    return (
      <form onSubmit={this.handleFormSubmit} role="search">
        <input
          type="text"
          name="query"
          id="query"
          className={cx({'has-value': !!this.state.query})}
          autoComplete="off"
          autoFocus={true} value={this.state.query || ""}
          onChange={this.onValueChange}
        />
        <label htmlFor="query">
          {placeHolder}
        </label>
      </form>
    )
  }
}
