'use strict';

import React from "react";
import FromNow from "../tools/from-now";
var _ = require('lodash');
var LineChart = require('react-chartjs').Line;

var ServerHistorgram = React.createClass({

  _buildDataSet: function (labels, data) {
    return {
      labels: labels,
      datasets: [
        {
          label: 'last 20 pings',
          fillColor: 'rgba(220,220,220,0.2)',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: data
        }
      ]
    }
  },

  _buildLabels: function (server) {
    return _.map(server.latestPings, (ping)=> {
      return ping.dateCreated
    });
  },

  _buildValues: function (server) {
    return _.map(server.latestPings, (ping)=> {
      return ping.responseTime
    });
  },

  render: function () {
    var server = this.props.server;
    var labels = this._buildLabels(server)
    var values = this._buildValues(server)
    var dataSet = this._buildDataSet(labels, values)
    return (
      <div className="graph">
        <LineChart data={dataSet} options={{responsive: true}}/>
      </div>
    );
  }
});
module.exports = ServerHistorgram;

