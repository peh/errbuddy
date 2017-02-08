import React from "react";

export default class Hero extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="jumbotron">
            <div className="container">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }

}
