import React from "react";
import BaseComponent from "../tools/base-component";
import LoadingHero from "../tools/loading-hero";
import ReactPaginate from "react-paginate";
import {observer} from "mobx-react"
import {observable} from "mobx";
import Highlighter from "react-highlight-words";

@observer
export default class ApplicationList extends BaseComponent {
  constructor(props) {
    super(props)
  }

  @observable total = 0;
  @observable max = 20;
  @observable offset = 0;
  @observable applications = [];
  @observable loading = false;
  @observable query = "";

  componentDidMount() {
    this.getApplicationList();
  }

  async getApplicationList() {
    this.loading = true;
    try {
      let response = await this.getApplicationService().list(this.max, this.offset, this.query);
      this.total = response.total;
      this.applications = response.applications;
      this.loading = false;
    } catch (e) {
      this.showError('Failed to fetch Applications from Server');
      this.loading = false;
      throw e;
    }
  }

  changePage(pageObj) {
    this.offset = pageObj.selected * this.max;
    this.getApplicationList();
  }

  getTableRows() {
    return this.applications.map(app => {
      return (<tr key={app.id}>
        <td>
          <Highlighter
            highlightClassName="query-match"
            searchWords={[this.query]}
            autoEscape={true}
            textToHighlight={app.name}
          />
        </td>
        <td>{app.latest}</td>
        <td><a href="javascript: void(0)" className="btn btn-sm btn-default" onClick={() => {
          this.navigate(`/applications/${app.id}`)
        }}><i className="fa fa-cog"></i></a></td>
      </tr>)
    })
  }

  async onQueryChange(e) {
    this.query = e.target.value;
    this.offset = 0;
    await this.getApplicationList();
  }

  render() {
    if (this.applications.length === 0) {
      return <LoadingHero/>
    }

    return (
      <section className="application-list">
        <input type="search" className="form-control" placeholder="Search" onChange={::this.onQueryChange} value={this.query}/>
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
          {this.getTableRows()}
          </tbody>
        </table>
        <ReactPaginate
          pageCount={Math.ceil(this.total / this.max)}
          pageRangeDisplayed={4}
          marginPagesDisplayed={1}
          forceSelected={Math.floor(this.offset / this.max)}
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
