import React from "react";
import BaseComponent from "../tools/base-component";
import * as  _ from "lodash";
import LoadingHero from "../tools/loading-hero";

export default class ApplicationList extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      applications: [],
      total: 0
    }

    this._bindThis('getApplicationList')
    setTimeout(this.getApplicationList, 250)
  }

  getApplicationList() {
    this.getApplicationService().list(0, 10)
      .then((json) => {
        this.setState(_.assign(this.state, {applications: json.applications, total: json.total}))
      })
      .catch((err) => {
        this.showError('Failed to fetch Applications from Server');
        throw err;
      });

  }

  componentDidMount() {
    this.setInterval(this.getApplicationList, 5000)
  }

  componentWillUnmount() {
    this.stopInterval()
  }

  render() {
    const {applications, total} = this.state;
    if (applications.length === 0) {
      return <LoadingHero />
    }

    let rows = _.map(this.state.applications, (app) => {
      return (
        <tr key={app.id}>
          <td>{app.name}</td>
          <td>{app.latest}</td>
          <td><a href="javascript: void(0)" className="btn btn-sm btn-default" onClick={() => {
            this.navigate(`/applications/${app.id}`)
          }}><i className="fa fa-cog"></i></a></td>
        </tr>
      )
    })
    return (
      <section className="application-list">
        <table className="table table-hover">
          <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>
              <button className="btn btn-xl btn-success pull-right" onClick={() => {
                this.navigate('/applications/add')
              }}><i className="fa fa-plus"></i></button>
            </th>
          </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </table>
      </section>
    )
  }
}
