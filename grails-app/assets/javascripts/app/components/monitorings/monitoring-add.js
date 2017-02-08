'use strict';

var _ = require('lodash');
var MonitoringIcon = require('./icon.jsx');

import React from "react";
import Icon from "../tools/icon";
import BaseComponent from "../tools/base-component";

export default class MonitoringAdd extends BaseComponent {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 jumbotron">
            <div className="container">
              <h1><MonitoringIcon type="SERVER"/> Server</h1>
              <p>Simple ICMP pings ~ once a minute</p>
              <p>Tests if Server is reachable and logs latency.</p>
              <p><a className="btn btn-primary btn-lg" onClick={()=> {
                this.navigate('/monitorings/add/server')
              }} role="button"><Icon icon="check">Choose</Icon></a></p>
            </div>
          </div>

        </div>
        <div className="row">
          <div className="col-sm-12 jumbotron">
            <div className="container">
              <h1><MonitoringIcon type="SERVICE"/> Service Monitoring</h1>
              <p>HTTP Head requests to a specified URL ~ once a minute.</p>
              <p>Tests HTTP response code and logs response times. We are working on detailed response checks and logs!</p>
              <p><a className="btn btn-primary btn-lg" onClick={()=> {
                this.navigate('/monitorings/add/service')
              }} role="button"><Icon icon="check">Choose</Icon></a></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
