import React from "react";
import BaseComponent from "../tools/base-component";
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts";
import LoadingHero from "../tools/loading-hero";
import Hero from "../tools/hero";
const moment = require('moment');
export default class EntryHistogram extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      first: true,
      loading: true
    };
    this._bindThis('loadObjectsFromServer')
  }

  loadObjectsFromServer() {
    this.getErrorService().histogram(this.props.entryGroup).then(json => {
      this.updateState({data: json.data, first: false, loading: false})
    });
  }

  componentDidMount() {
    this.loadObjectsFromServer();
    // this.setInterval(this.loadObjectsFromServer, 5000);
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  render() {
    const {data, first, loading} = this.state;
    if (loading) {
      return <LoadingHero />
    } else if (data.length == 0) {
      return <Hero><h2>No Data found</h2></Hero>
    } else {
      return (
        <ResponsiveContainer width={"100%"} height={400}>
          <LineChart data={data}>
            <Line dataKey="value" animationDuration={500} isAnimationActive={first}/>
            <XAxis tick={<CustomizedTick data={data}/>}/>
            <YAxis />
            <Tooltip isAnimationActive={false} content={<CustomTooltip/>}/>
            <CartesianGrid vertical={false}/>
          </LineChart>
        </ResponsiveContainer>
      )
    }

  }

}

class CustomizedTick extends React.Component {
  render() {
    const {x, y, payload, data} = this.props;
    let time = data[payload.index].time;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={10} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)" className="tick">{moment(time).format('LT')}</text>
      </g>
    )
  }
}


class CustomTooltip extends React.Component {
  render() {
    const {payload} = this.props;
    let value = 0;
    let time = 0;
    if (payload && payload.length > 0) {
      time = payload[0].payload.time
      value = payload[0].value
    }
    return (
      <div className="custom-tooltip">
        {`${moment(time).format('LT')} : ${value}`}
      </div>
    )
  }
}
