import * as  _ from "lodash";
import React from "react";

export default class ObjectDL extends React.Component {

  render() {
    var items = [];
    _.each(this.props.obj, (val, key)=> {
      items.push(<dt key={`dt-${key}`}>{key}</dt>);
      items.push(<dd key={`dd-${key}`}><pre className="object-dl">{JSON.stringify(val, 1, 1 )}</pre></dd>);
    })
    return (
      <dl>
        {items}
      </dl>
    );
  }

}
