import _ from "lodash";
import FromNow from "../tools/from-now";
import FormatedDate from "../tools/formated-date";
import React from "react";
import BaseComponent from "../tools/base-component";
import ReactPaginate from "react-paginate";
const cx = require('classnames');
const rd3 = require('react-d3');
const LineChart = rd3.LineChart;

export default class ServiceChecksList extends BaseComponent {

  constructor(props) {
    super(props)

    this.state = {
      checks: [],
      total: 1
    }

    this.loadObjectsFromServer()
  }

  loadObjectsFromServer() {
    if (this.props.monitoring.id) {
      let max = this.getMax();
      let offset = this.getOffset();
      this.getMonitoringService().checks(this.props.monitoring, {max, offset}).then(json=> {
        this.setState(_.assign(this.state, {
          checks: json.checks,
          total: json.total
        }));
      });
    }
  }

  render() {
    /*let chartData = _.map(this.state.checks, (check)=>{
     return {label: check.dateCreated, value: check.responseTime};
     });
     return (<LineChart data={chartData} width={500} height={200} fill={'#3182bd'} />)*/
    let offset = this.getOffset();
    let max = this.getMax();
    const {checks, total} = this.state
    var rows = _.map(checks, (check)=> {
      var rowClass = cx({'success': check.okay, 'danger': !check.okay});
      return (<tr key={'check-' + check.id} className={rowClass}>
        <td><FromNow time={check.dateCreated}/> (<FormatedDate time={check.dateCreated} format="MM.D.YY HH:mm:ss"/>)</td>
        <td>{check.responseCode}</td>
        <td>{check.responseTime}ms</td>
      </tr>)
    });


    return (
      <div className="row">
        <div className="col-sm-12">
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
          <table className="table table-hover table-condensed">
            <thead>
            <tr>
              <th>Time</th>
              <th>StatusCode</th>
              <th>Response Time</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    );
  }

}

module.exports = ServiceChecksList;
