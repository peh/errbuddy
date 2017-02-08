'use strict';

var _ = require('lodash');

var cx = require('classnames');

import React from "react";
import MonitoringListRow from "./monitoring-list-row";
import LoadingHero from "../tools/loading-hero";
import BaseComponent from "../tools/base-component";
import ReactPaginate from "react-paginate";

export default class MonitoringList extends BaseComponent {

  constructor(props) {
    super(props)

    this.state = {
      monitorings: null,
      unfilteredTotal: -1,
      showDisabled: false,
      type: null,
      status: null
    }

    this._bindThis('loadObjectsFromServer')
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.urlParameters || _.get(newProps.urlParameters, 'offset') !== `${this.getOffset()}`) {
      this.loadObjectsFromServer(newProps.urlParameters)
    }
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  componentDidMount() {
    this.setInterval(this.loadObjectsFromServer, 5000);
  }

  _toggleShowDisabled() {
    this.state.showDisabled = !this.state.showDisabled
    this.setState(this.state)
    this.loadObjectsFromServer()
  }

  _toggleTypeFilter(e) {
    var target = e.target
    if (target.nodeName === 'I') {
      target = target.parentElement
    }
    var type = target.getAttribute('data-type')
    if (this.state.type === type) {
      this.state.type = null;
    } else {
      this.state.type = type;
    }
    this.setState(this.state)
    this.loadObjectsFromServer();
  }

  _toggleStatusFilter() {
    switch (this.state.status) {
      case 'green' :
        this.state.status = null
        break
      case 'yellow' :
        this.state.status = 'green'
        break
      case 'red' :
        this.state.status = 'yellow'
        break
      default :
        this.state.status = 'red'
    }
    this.setState(this.state)
    this.loadObjectsFromServer()
  }

  _clearFilters() {
    this.state.type = null;
    this.state.status = null;
    this.state.showDisabled = false;
    this.setState(this.state);
    this.loadObjectsFromServer();
  }

  componentWillMount() {
    this._clearFilters()
    this.loadObjectsFromServer(true);
  }

  componentDidMount() {
    this.setInterval(this.loadObjectsFromServer, 10000);
  }

  loadObjectsFromServer(props) {
    let offset = _.get(props, 'offset') || this.getOffset();
    let max = _.get(props, 'max') || this.getMax();

    this.getMonitoringService().list({offset, max})
      .then(json=> {
        if (json.monitorings.length === 0 && offset > 0) {
          this.navigate("/monitorings/")
        } else {
          this.setState(_.assign(this.state, {
            monitorings: json.monitorings,
            unfilteredTotal: json.unfilteredTotal,
            total: json.total,
            loading: false
          }))
        }
      });
  }

  changePage(pageObj) {
    if (!this.state.loading) {
      let max = this.getMax();
      let offset = pageObj.selected * max;
      this.navigate(`/monitorings/?${querystring.stringify({max, offset})}`);
    }
  }

  render() {
    const {loading, monitorings, unfilteredTotal, total} = this.state
    let offset = this.getOffset();
    let max = this.getMax();
    if (unfilteredTotal === -1) {
      return <LoadingHero />
    } else if (unfilteredTotal === 0) {
      return (
        <div className="row center-parent">
          <div className="center-child jumbotron">
            <div className="container">
              <h1>Nothing is currently monitored.</h1>
              <p>You can start monitoring by setting up a new target</p>
              <p>
                <a className="btn btn-primary btn-lg" onClick={() => {
                  this.navigate('/monitorings/add')
                }} role="button">
                  <i className="fa fa-plus"></i>&nbsp;Setup</a>
              </p>
            </div>
          </div>
        </div>
      )
    }
    var rows = _.map(monitorings, (server)=> {
      return <MonitoringListRow monitoring={server} key={server.id} errbuddyApp={this.props.errbuddyApp}/>
    });

    var showDisabledButtonClasses = cx('btn', {
      'btn-default': !this.state.showDisabled,
      'btn-success': this.state.showDisabled
    })
    var buttons = []
    buttons.push(<button key="filter-icon" type="button" className="btn btn-default disabled">
      <i className="fa fa-filter"></i>
    </button>)
    buttons.push(<button key="show-disabled" type="button" onClick={this._toggleShowDisabled} className={showDisabledButtonClasses}>Show Disabled</button>)
    _.each(['SERVER', 'SERVICE'], (type) => {
      var clazzes = cx('btn', {
        'btn-default': this.state.type != type,
        'btn-success': this.state.type == type
      })
      var icon
      switch (type) {
        case 'SERVER' :
          icon = (
            <i className="fa fa-server"></i>
          );
          break;
        case 'SERVICE' :
          icon = (
            <i className="fa fa-globe"></i>
          );
          break;
        default :
          icon = type;
      }
      buttons.push(<button key={type} type="button" onClick={this._toggleTypeFilter} data-type={type} className={clazzes}>{icon}</button>)
    })
    let statusButtonClasses = cx('btn', {
      'btn-default': this.state.status === null,
      'btn-success': this.state.status === 'green',
      'btn-warn': this.state.status === 'yellow',
      'btn-danger': this.state.status === 'red'
    })
    buttons.push(<button key="status-icon" type="button" className={statusButtonClasses} onClick={this._toggleStatusFilter}>
      <i className="fa fa-check"></i>
    </button>)
    buttons.push(<button key="clear-icon" type="button" className="btn btn-default" onClick={this._clearFilters}>
      <i className="fa fa-trash"></i>
    </button>)

    return (
      <div>
        <div className="row">
          <div className="col-sm-1">
            <a className="btn btn-primary" onClick={() => {
              this.navigate('/monitorings/add')
            }} role="button">
              <i className="fa fa-plus"></i>
              Add</a>
          </div>
          <div className="col-sm-5">
            <div className="btn-group" role="group" aria-label="Filters">
              {buttons}
            </div>
          </div>
          <div className="col-sm-6">
            <ReactPaginate
              pageNum={Math.ceil(total / max)}
              forceSelected={Math.floor(offset / max)}
              clickCallback={this.changePage}
              previousLabel="&laquo;"
              nextLabel="&raquo;"
              breakLabel={<a href="">...</a>}
              marginPagesDisplayed={5}
              activeClassName="active"
              containerClassName="pagination"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 monitorings-list">
            {rows}
          </div>
        </div>
      </div>
    );
  }
}
