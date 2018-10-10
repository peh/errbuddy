'use strict';

import React from "react";
import * as  _ from "lodash";
import BaseComponent from "../tools/base-component";
import LoadingHero from "../tools/loading-hero";
import EntryGroupTableRow from "./list-row";
import ReactPaginate from "react-paginate";
import ConfigurationService from "../../services/configuration-service";
import Hero from "../tools/hero";
import {observer} from "mobx-react"
import {observable} from "mobx";

const cx = require('classnames');
const querystring = require('querystring');

@observer
export default class ErrorList extends BaseComponent {
  constructor(props) {
    super(props);

    this.selectedApplication = ConfigurationService.get('errbuddy.applicaiton.selected') || null;

    this._bindThis('loadObjectsFromServer',
      'handlePausedChange',
      'toggleApplicationFilter',
      'changePage',
      'getMax',
      'getOffset',
      'doLoad'
    );

    this.offset = this.offset || this.getOffset();
    this.max = this.max || this.getMax();

  }

  @observable selectedApplication;
  @observable applications = [];
  @observable total = -1;
  @observable loading = false;
  @observable errors = [];
  @observable offset = null;
  @observable max = null;

  async componentWillReceiveProps(newProps) {
    this.offset = this.offset || this.getOffset();
    this.max = this.max || this.getMax();
    await this.loadObjectsFromServer();
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  async componentDidMount() {
    let resp = await this.getApplicationService().list(100, 0);
    this.applications = resp.applications;
    this.loadObjectsFromServer();
    this.setInterval(this.loadObjectsFromServer, 2000);
  }

  handlePausedChange(paused) {
    this.loadObjectsFromServer(!paused)
  }

  async loadObjectsFromServer(props) {
    this.loading = true;
    try {
      let resp = await this.getErrorService().list(this.max, this.offset, this.getQuery(), this.selectedApplication);
      let list = resp.result;
      this.total = resp.total;
      if (list.length < 1 && this.offset > 0) {
        // we are clearly on a page where we should not be, reset the state and load again
        this.navigate("/errors/")
        this.errors = [];
      } else {
        this.errors = list;
        this.loading = false;
      }
    } catch (err) {
      this.loading = false;
      throw err
    }
  }

  getQuery() {
    return _.get(this.props.urlParameters, 'query') || "";
  }

  async toggleApplicationFilter(appId) {
    if (this.selectedApplication === appId) {
      appId = null
    }
    ConfigurationService.set('errbuddy.applicaiton.selected', appId);
    this.selectedApplication = appId;
    this.total = -1;
    await this.loadObjectsFromServer(true)
  }

  async changePage(pageObj) {
    this.offset = pageObj.selected * this.max;
    this.navigate(`/?${querystring.stringify({max: this.max, offset: this.offset, query: this.getQuery()})}`, true);
    await this.loadObjectsFromServer();
  }

  getApplicationButtons() {
    return this.applications.map(app => {
      let buttonClasses = cx('btn', {
        'btn-default': app.id !== this.selectedApplication,
        'active': app.id === this.selectedApplication,
      });
      return (
        <button key={`app-choose-${app.id}`} type="button" className={buttonClasses} onClick={() => {
          this.toggleApplicationFilter(app.id)
        }}>{app.name}</button>
      )
    })
  }

  render() {
    let rows = "";

    if (this.total === -1 && this.loading) {
      rows = <LoadingHero />;
    } else if (this.errors && this.errors.length === 0 && _.get(this.props.urlParameters, 'query')) {
      rows = <Hero><h3>No Results found for "{_.get(this.props.urlParameters, 'query')}".</h3></Hero>;
    } else if (this.errors && this.errors.length === 0) {
      rows = <Hero><h3>No Errors. Yeah!</h3></Hero>;
    } else if (this.errors && this.errors.length > 0) {
      rows = _.map(this.errors, (entryGroup) => {
        return <EntryGroupTableRow
          applications={this.applications}
          ref={entryGroup.entryGroupId}
          entryGroup={entryGroup}
          key={entryGroup.entryGroupId}
          errbuddyApp={this.props.errbuddyApp}
        />
      });
    }

    return (
      <section className="entry-list-container">
        <div className="head">
          <div className="btn-group application-chooser" role="group">
            {this.getApplicationButtons()}
          </div>
          <ReactPaginate
            disabled={true}
            pageCount={Math.ceil(this.total / this.max)}
            pageRangeDisplayed={4}
            marginPagesDisplayed={1}
            initialPage={Math.floor(this.offset / this.max)}
            forceSelected={Math.floor(this.offset / this.max)}
            onPageChange={::this.changePage}
            previousLabel="&laquo;"
            nextLabel="&raquo;"
            breakLabel={<a href="">...</a>}
            activeClassName="active"
            containerClassName="pagination"
          />
        </div>
        <div className="list">
          {rows}
        </div>
      </section>
    );
  }

}
