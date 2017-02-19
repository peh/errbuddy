import React from "react";

export default class Hero extends React.Component {

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          {this.props.children}
        </div>
      </div>
    )
  }

}
