'use strict';

var ReactMiniRouter = require('react-mini-router');
var EntryEvents = require('../../events/entry-events');
var AppEvents = require('../../events/application-events');

import React from "react";
import BaseComponent from "../tools/base-component";
import * as  _ from "lodash";

export default class NavbarSearchForm extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      query: ""
    };

    this._bindThis('handleFormSubmit', 'onValueChange', 'doSearch')
  }

  handleFormSubmit(e) {
    ReactMiniRouter.navigate('/errors/1');
    this.doSearch();
    e.preventDefault();
  }

  onValueChange(e) {
    console.log(e.target.value);
    this.setState(_.assign(this.state, {
      query: e.target.value
    }));
  }

  doSearch() {
    this.getEmitter().emit(EntryEvents.SEARCH_QUERY_CHANGED, this.state.query);
  }

  componentDidMount() {
    this.getEmitter().on(AppEvents.ACTION_CHANGED, (action)=> {
      if (action === 'errors' && this.state.query != null) {
        setTimeout(()=> {
          this.getEmitter().emit(EntryEvents.SEARCH_QUERY_CHANGED, this.state.query);
        }, 100)
      }
    })
  }

  render() {
    var placeHolder = 'use * as a wildcard and combine terms with AND / OR';
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
