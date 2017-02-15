import React from "react";

export default class EntryRefindButton extends React.Component {
  render() {
    return (
      <button className="btn btn-errbuddy btn-warning" onClick={this.props.onClick}>
        <i className="fa fa-undo"></i> Refind
      </button>
    );
  }

}

