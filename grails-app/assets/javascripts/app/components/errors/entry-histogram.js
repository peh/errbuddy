import Measure from "react-measure";
import React from "react";
import BaseComponent from "../tools/base-component";
import {Area} from "salad-ui.chart";
import LoadingHero from "../tools/loading-hero";

export default class EntryHistogram extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this._bindThis('loadObjectsFromServer')

  }

  loadObjectsFromServer(force) {
    if ((force === true)) {
      this.getErrorService().histogram(this.props.entryGroup).then(json => {
        this.updateState({data: json.data})
      });
    }
  }

  componentDidMount() {
    this.loadObjectsFromServer(true);
    this.setInterval(this.loadObjectsFromServer, 5000);
  }

  render() {
    if (this.state.data.length == 0) {
      return <LoadingHero />
    }
    return (
      <Measure>
        {dimensions =>
          <div>
            <Area
              pointsRadius={3}
              strokeWidth={1}
              width={parseInt(dimensions.width)}
              height={250}
              maxOverflow={0}
              labelTemplate={data => {
                return `data ${data.value}`
              }}
              data={this.state.data}
            />
          </div>
        }
      </Measure>
    )
  }

}
