'use strict';

import React from "react";
import LoadingHero from "../tools/loading-hero";
import BaseComponent from "../tools/base-component";
import ReactPaginate from "react-paginate";
import FormatedDate from "../tools/formated-date";
import FromNow from "../tools/from-now";
import EntryLocationItem from "./entry-location-item";
const cx = require('classnames');
const querystring = require('querystring');

export default class EntryDetailsTable extends BaseComponent {

  constructor(props) {
    super(props);

    this._bindThis("getTableRow");
  }

  getTableRow(e) {
    const {entryGroup, entry, max, offset} = this.props;
    var rowClasses = cx('clickable', {
      'warning': e.id == entry.id
    });
    return (
      <tr className={rowClasses} onClick={()=> {
        this.navigate(`/errors/${entryGroup.entryGroupId}/${e.id}?${querystring.stringify({max, offset})}`)
      }} key={e.id}>
        <td>
          <FormatedDate time={e.time}/> (<FromNow time={e.time}/>)
        </td>
        <td>{e.hostname}</td>
        <td className="cut-text">{e.exception}</td>
        <td className="cut-text">{e.message}</td>
        <td className="cut-text">
          <EntryLocationItem entry={e}/>
        </td>
      </tr>
    )
  }

  render() {
    const {list, offset, max, total} = this.props;
    if (!list) {
      return <LoadingHero />
    }
    let rows = _.map(list, e=> {
      return this.getTableRow(e)
    });
    return (
      <div className="col-sm-12">
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-hover table-condensed">
              <thead>
              <tr>
                <th>Time</th>
                <th>Hostname</th>
                <th>Exception</th>
                <th>Message</th>
                <th>Location</th>
              </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <ReactPaginate
              pageNum={Math.ceil(total / max)}
              forceSelected={Math.floor(offset / max)}
              clickCallback={this.props.changePage}
              previousLabel="&laquo;"
              nextLabel="&raquo;"
              breakLabel={<a href="">...</a>}
              marginPagesDisplayed={5}
              activeClassName="active"
              containerClassName="pagination"
            />
          </div>
        </div>

      </div>
    );
  }

}
