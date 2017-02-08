import _ from "lodash";
import React from "react";

export default class ObjectDL extends React.Component {

  render() {
    var items = [];
    _.each(this.props.obj, (val, key)=> {
      items.push(<dt key={`dt-${key}`}>{key}</dt>);
      items.push(<dd key={`dd-${key}`}>{JSON.stringify(val)}</dd>);
    })
    return (
      <dl>
        {items}
      </dl>
    );
  }

}
