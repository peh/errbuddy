import React from "react";

const PLACEHOLDER_TEXT = 'use * as a wildcard and combine terms with AND / OR';

export default class SearchBar extends React.Component {

  render() {
    return (
      <form onSubmit={() => {
        this.props.onSubmit(this.refs.query.value)
      }} className="navbar-form" role="search">
        <div className="form-group navbar-search-container">
          <div className="input-group">
            <label className="control-label sr-only" htmlFor="query">
              {PLACEHOLDER_TEXT}
            </label>
            <input type="text" ref="query" name='query' id="query" className="form-control" autoComplete="off" autofocus="autofocus" value={this.props.query}
                   placeholder={PLACEHOLDER_TEXT}/>
            <span className="input-group-addon">
              <i className="fa fa-search"></i>
            </span>
          </div>
        </div>
      </form>
    )
  }
}
