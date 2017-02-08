import React from "react";

export default class EntryLocationItem extends React.Component {

  render() {
    if (this.props.entry.controllerName) {
      return (
        <span>
              {this.props.entry.controllerName}
          <i className="fa fa-long-arrow-right"></i>
          {this.props.entry.actionName}
        </span>
      )
    } else if (this.props.entry.serviceName) {
      return (<span>{this.props.entry.serviceName}</span>)
    } else {
      return (<span>{this.props.entry.path}</span>)
    }
  }

}
