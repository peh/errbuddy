'use strict';

import React from "react";
import BaseComponent from "../tools/base-component";
import * as querystring from "querystring";

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
      <form onSubmit={this.handleFormSubmit} className="navbar-form" role="search">
        <div className="form-group navbar-search-container">
          <div className="input-group">
            <label className="control-label sr-only" htmlFor="query">
              {placeHolder}
            </label>
            <input type="text" name="query" id="query" className="form-control" autoComplete="off"
                   autoFocus={true} value={this.state.query || ""}
                   onChange={this.onValueChange}
                   placeholder={placeHolder}/>
            <span className="input-group-addon"><i className="fa fa-search"></i></span>
          </div>
        </div>
      </form>
    )
  }
}
