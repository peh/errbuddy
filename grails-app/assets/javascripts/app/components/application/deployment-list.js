'use strict'

const moment = require('moment');
const querystring = require('querystring');
import React from "react";
import BaseComponent from "../tools/base-component";
import * as  _ from "lodash";
import ReactPaginate from "react-paginate";

export default class DeploymentList extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      deployments: [],
      total: 0
    };

    this._bindThis('loadObjectsFromServer', 'changePage')
  }

  componentDidMount() {
    this.setInterval(this.loadObjectsFromServer, 10000);
    this.loadObjectsFromServer();
  }

  componentWillReceiveProps(newProps) {
    try {
      let offset = parseInt(_.get(newProps.urlParameters, 'offset'));
      if (!isNaN(offset) && offset !== this.getOffset()) {
        this.loadObjectsFromServer(newProps.urlParameters)
      }
    } catch (e) {
      // noop
    }
  }

  componentWillUnmount() {
    this.stopInterval()
  }

  loadObjectsFromServer(props) {
    let offset = _.get(props, 'offset') || this.getOffset();
    let max = _.get(props, 'max') || this.getMax();
    let app = this.props.application;
    this.getDeploymentService().list(app.id, {max: max, offset: offset})
      .then((resp) => {
        this.updateState({deployments: resp.deployments, total: resp.total});
      })
      .catch((err) => {
        this.showError("Could not get deployments from server");
        throw err
      })
  }

  changePage(pageObj) {
    if (!this.state.loading) {
      let max = this.getMax();
      let offset = pageObj.selected * max;
      this.navigate(`/applications/${this.props.application.id}?${querystring.stringify({max, offset})}`);
    }
  }

  render() {
    const {deployments, total} = this.state;
    let offset = this.getOffset();
    let max = this.getMax();
    let rows = _.map(deployments, (deployment) => {
      return (
        <tr key={`deployment-${deployment.id}`}>
          <td>{moment(deployment.dateCreated).fromNow()} ({moment(deployment.dateCreated).format('LLL')})</td>
          <td>{deployment.versionString}</td>
          <td>{deployment.hostname}</td>
        </tr>
      );

    });
    return (
      <div>
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
    );
  }

}
