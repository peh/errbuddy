'use strict'

var moment = require('moment');
var Pager = require('../pager/main.jsx');

import React from "react";
import BaseComponent from "../tools/base-component";
import _ from 'lodash'
export default class DeploymentList extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      deployments: [],
      pages: 1,
      page: 1
    };

    this.loadObjectsFromServer();
    this.setInterval(this.loadObjectsFromServer.bind(this), 10000)
    this._bindThis('loadObjectsFromServer')
  }

  componentWillUnmount() {
    this.stopInterval()
  }

  setPage(page) {
    this.page = page;
    this.loadObjectsFromServer();
  }

  loadObjectsFromServer() {
    var max = 15;
    var currentPage = parseInt(this.page);
    var offset = max * (currentPage - 1);
    var app = this.props.application;
    this.getDeploymentService().list(app.id, {max: max, offset: offset})
      .then((resp)=> {
        this.setState(_.assign(this.state, {deployments: resp.deployments, pages: Math.ceil(resp.total / max)}));
      })
      .catch((err)=> {
        this.showError("Could not get deployments from server");
        throw err
      })
  }

  render() {
    var rows = [];
    for (var i = 0; i < this.state.deployments.length; i++) {
      var deployment = this.state.deployments[i];
      rows.push(
        <tr key={'deployment-' + deployment.id}>
          <td>{moment(deployment.dateCreated).fromNow()} ({moment(deployment.dateCreated).format('LLL')})</td>
          <td>{deployment.versionString}</td>
          <td>{deployment.hostname}</td>
        </tr>
      );
    }
    return (
      <div className="row">
        <div className="col-sm-12">
          <Pager pathPrefix="/deployments/" pages={this.state.pages} setPage={this.setPage} current={this.page}
                 ref="pager"/>
          <table className="table table-hover table-condensed">
            <thead>
            <tr>
              <th>Time</th>
              <th>version</th>
              <th>Host</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    );
  }

}
