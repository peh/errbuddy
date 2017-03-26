'use strict';

import React from "react";
import * as  _ from "lodash";
import BaseComponent from "../tools/base-component";
import LoadingHero from "../tools/loading-hero";
import EntryGroupTableRow from "./list-row";
import ReactPaginate from "react-paginate";
import ConfigurationService from "../../services/configuration-service";
import Hero from "../tools/hero";
const cx = require('classnames');
const querystring = require('querystring');

export default class ErrorList extends BaseComponent {
  constructor(props) {
    super(props);

    let selectedApplication = ConfigurationService.get('errbuddy.applicaiton.selected');

    this.state = {
      list: [],
      total: 0,
      applications: null,
      selectedApplication: selectedApplication || null,
      loading: false
    };

    this._bindThis('loadObjectsFromServer',
      'handlePausedChange',
      'toggleApplicationFilter',
      'changePage',
      'getMax',
      'getOffset',
      'doLoad'
    );

  }

  componentWillReceiveProps(newProps) {
    if (
      !this.props.urlParameters ||
      _.get(newProps.urlParameters, 'offset') !== `${this.getOffset()}` ||
      _.get(this.props.urlParameters, 'query') !== _.get(newProps.urlParameters, 'query')) {
      this.loadObjectsFromServer(newProps.urlParameters)
    }
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  componentDidMount() {
    this.getApplicationService().list(0, 10000).then(applications => {
      this.updateState({applications: applications.applications}).then(this.loadObjectsFromServer);
    });
    this.setInterval(this.loadObjectsFromServer, 2000);
  }

  handlePausedChange(paused) {
    this.loadObjectsFromServer(!paused)
  }

  loadObjectsFromServer(props) {
    this.setState(_.assign(this.state, {loading: true}), () => {
      // debugger
      this.doLoad(props)
    });
  }

  doLoad(props) {
    const {selectedApplication} = this.state;
    let offset = _.get(props, 'offset') || this.getOffset();
    let max = _.get(props, 'max') || this.getMax();
    this.getErrorService().list(max, offset, this.getQuery(), selectedApplication)
      .then((json) => {
        let list = json.result;
        let total = json.total;
        if (list.length < 1 && offset > 0) {
          // we are clearly on a page where we should not be, reset the state and load again
          this.navigate("/errors/")
        } else {
          this.setState(_.assign(this.state, {list: list, total: total, loading: false}))
        }
      })
      .catch((err) => {
        this.setState(_.assign(this.state, {loading: false}));
        throw err
      });
  }

  getQuery() {
    return _.get(this.props.urlParameters, 'query') || "";
  }

  toggleApplicationFilter(appId) {
    if (this.state.selectedApplication === appId) {
      appId = null
    }
    ConfigurationService.set('errbuddy.applicaiton.selected', appId);
    this.setState(_.assign(this.state, {selectedApplication: appId}));
    this.loadObjectsFromServer(true)
  }

  changePage(pageObj) {
    if (!this.state.loading) {
      let max = this.getMax();
      let offset = pageObj.selected * max;
      let query = this.getQuery()
      this.navigate(`/?${querystring.stringify({max, offset, query})}`);
    }
  }

  render() {
    const {list, total} = this.state;
    let offset = this.getOffset();
    let max = this.getMax();
    if (!list) {
      return <LoadingHero />
    }

    let rows = ""

    if (list && list.length === 0 && _.get(this.props.urlParameters, 'query')) {
      rows = <Hero><h3>No Results found for "{_.get(this.props.urlParameters, 'query')}. Try searching for something different!"</h3></Hero>;
    } else if (list && list.length === 0) {
      rows = <Hero><h3>No Errors. Yeah!</h3></Hero>;
    } else if (list && list.length > 0) {
      rows = _.map(list, (entryGroup) => {
        return <EntryGroupTableRow
          applications={this.state.applications}
          ref={entryGroup.entryGroupId}
          entryGroup={entryGroup}
          key={entryGroup.entryGroupId}
          errbuddyApp={this.props.errbuddyApp}
        />
      });
    }

    let toggledApplication = this.state.selectedApplication;
    let buttons = _.map(this.state.applications, (app) => {
      let buttonClasses = cx('btn', {
        'btn-default': app.id !== toggledApplication,
        'active': app.id === toggledApplication,
      });
      return (
        <button key={`app-choose-${app.id}`} type="button" className={buttonClasses} onClick={() => {
          this.toggleApplicationFilter(app.id)
        }}>{app.name}</button>
      )
    });
    return (
      <section className="entry-list-container">
        <div className="head">
          <div className="btn-group application-chooser" role="group">
            {buttons}
          </div>
          <ReactPaginate
            pageCount={Math.ceil(total / max)}
            pageRangeDisplayed={4}
            marginPagesDisplayed={1}
            forceSelected={Math.floor(offset / max)}
            onPageChange={this.changePage}
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
