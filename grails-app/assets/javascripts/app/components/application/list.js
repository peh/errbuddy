import React from "react";
import BaseComponent from "../tools/base-component";
import * as  _ from "lodash";
import LoadingHero from "../tools/loading-hero";
import ReactPaginate from "react-paginate";

export default class ApplicationList extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      applications: [],
      total: 0,
      max: 20,
      offset: 0
    };
  }

  componentDidMount() {
    this.getApplicationList();
  }

  getApplicationList() {
    let {max, offset} = this.state;
    this.getApplicationService().list(offset, max)
      .then((json) => {
        this.setState(_.assign(this.state, {applications: json.applications, total: json.total}))
      })
      .catch((err) => {
        this.showError('Failed to fetch Applications from Server');
        throw err;
      });

  }

  changePage(pageObj) {
    let offset = pageObj.selected * this.state.max;
    this.setState({...this.state, offset: offset}, () => {
      this.getApplicationList()
    });
  }

  render() {
    const {applications, total, max, offset} = this.state;
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
        <ReactPaginate
          pageCount={Math.ceil(total / max)}
          pageRangeDisplayed={4}
          marginPagesDisplayed={1}
          forceSelected={Math.floor(offset / max)}
          onPageChange={::this.changePage}
          previousLabel="&laquo;"
          nextLabel="&raquo;"
          breakLabel={<a href="">...</a>}
          activeClassName="active"
          containerClassName="pagination"
        />
      </section>
    )
  }
}
