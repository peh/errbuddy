'use strict';

import React from "react";
import FromNow from "../tools/from-now";
import BaseComponent from "../tools/base-component";
// var LineChart = require("react-chartjs").Line;
var cx = require('classnames');
var NavigatesMixin = require('../mixins/navigates-mixin');

export default class MonitoringListRow extends BaseComponent {

  constructor(props) {
    super(props)
  }

  render() {
    const monitoring = this.props.monitoring;

    let avg = monitoring.averageResponseTime;
    var pingTimeClasses = cx('ping-times', {hidden: !monitoring.enabled});
    let lastSeen = 'never'
    if (monitoring.lastSuccess) {
      lastSeen = <FromNow time={monitoring.lastSuccess}/>
    }

    let checkResult = (
      <span className="fa-stack fa-lg feature-icon">
          <i className="fa fa-globe fa-stack-1x"></i>
          <i className="fa fa-ban fa-stack-2x text-danger"></i>
        </span>
    )
    checkResult = ''
    if (monitoring.type === 'SERVICE') {
      // checkResult = (<div className={monitoring.status.toLowerCase()}><span>{countGood}</span> <span>of</span> <span>{monitoring.latestChecks.length}</span> <span>good checks</span></div>)
    }
    let pingResult = (<div className={cx({
      'none': avg <= 0,
      'green': avg > 0 && avg <= this._consideredBadResponseTime,
      'yellow': avg > this._consideredBadResponseTime
    })}>{monitoring.averageResponseTime}ms</div>)

    var rowClass = cx('list-row', monitoring.status.toLowerCase(), {disabled: !monitoring.enabled})
    let hostString = null
    if (monitoring.type === 'SERVER') {
      hostString = monitoring.hostname
    } else if (monitoring.type === 'SERVICE') {
      hostString = monitoring.url
    }
    return (
      <div className={rowClass} onClick={()=>{
        this.navigate(`/monitorings/${monitoring.id}`)
      }}>
        <div className="info">
          <h3>{monitoring.name}
            <small>({hostString})</small>
          </h3>
          <span>
              last seen: {lastSeen}
            </span>
        </div>
        <div className="url-check">
          {checkResult}
        </div>
        <div className={pingTimeClasses}>
          {pingResult}
        </div>
      </div>
    );
  }

}
// TODO: the numbers in here should be configurable!
var MonitoringListItem = React.createClass({

  mixins: [NavigatesMixin],

  _consideredBadResponseTime: 5000,

  _onRowClicked: function () {
    this._navigate(`/monitorings/details/${this.props.monitoring.id}`);
  },

  render: function () {

  }
});
module.exports = MonitoringListItem;
