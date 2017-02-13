const Chartist = require('chartist');
const moment = require('moment');
import React from "react";
import ReactDOM from "react-dom";
import BaseComponent from "../tools/base-component";
import * as _ from 'lodash';

export default class EntryHistogram extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      times: [],
      values: []
    }

    this._bindThis('onMouseOverpoint', 'getChart')

  }

  loadObjectsFromServer(force) {
    if ((force === true)) {
      this.getErrorService().histogram(this.props.entryGroup).then(data=> {
        if (data) {
          this.parseResponse(data.data);
        }
      });
    }
  }

  componentDidMount() {
    let options = this.props.options || {};
    let responsiveOptions = this.props.responsiveOptions || [];
    let event;

    let domNode = ReactDOM.findDOMNode(this);

    this._chartist = new Chartist.Line(domNode, this.state.data, options, responsiveOptions);
    const $chart = $(domNode);

    let $toolTip = $chart.children('.chart-tooltip');
    $chart.on('mouseenter', '.ct-point', this.onMouseOverpoint);
    $chart.on('mouseleave', '.ct-point', function () {
      $toolTip.addClass('hidden');
    });

    //register event handlers
    /**
     * listeners: {
     *   draw : function() {}
     * }
     */
    if (this.props.listener) {
      for (event in this.props.listener) {
        if (this.props.listener.hasOwnProperty(event)) {
          this.chartist.on(event, this.props.listener[event]);
        }
      }
    }
    this.loadObjectsFromServer(true);
    this.setInterval(this.loadObjectsFromServer, 5000);
  }

  getChart() {
    return $(ReactDOM.findDOMNode(this))
  }

  onMouseOverpoint(e) {
    let $point = $(e.target);
    let label = this._chartist.data.labels[$point.index()-1];
    let v = this._chartist.data.series[0][$point.index()-1];
    let value = `~ ${label} <br/> ${v}`;
    let $toolTip = this.getChart().children('.chart-tooltip');
    $toolTip.html(value).removeClass('hidden');
    $toolTip.css({
      left: e.target.x1.baseVal.value - ($toolTip.width() / 2) + 5,
      top: e.target.y1.baseVal.value - $toolTip.height() - 40
    });
  }

  componentWillUnmount() {
    this.stopInterval();
    if (this._chartist) {
      this._chartist.detach();
      this._chartist = null;
    }
  }

  parseResponse(data) {
    let labels = [];
    let values = [];
    _.each(data, (v, k)=> {
      labels.push(moment.unix(k / 1000).format('lll'));
      values.push(v);
    })
    this.setState(_.assign(this.state, {data: data}));
    if (this._chartist) {
      this._chartist.update({
        labels: labels,
        series: [values]
      })
    }

  }

  render() {
    return (
      <div className="ct-chart">
        <div className="chart-tooltip hidden"></div>
      </div>
    )
  }

}
