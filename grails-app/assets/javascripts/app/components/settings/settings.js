import React from "react";
import BaseComponent from "../tools/base-component";

export default class AppSettings extends BaseComponent {
  constructor(props) {
    super(props)
    this._bindThis('onReindex', 'reset')

    this.state = {
      alertStatus: null,
      alertMessage: ""
    }
  }

  onReindex() {
    this.getSettingsService().reindex().then(json => {
      this.updateState({alertStatus: "alert-success", alertMessage: "Reindex Job Started."})
    }).catch(t => {
      this.updateState({alertStatus: "alert-danger", alertMessage: t.toString()})
    })
  }

  reset() {
    this.updateState({alertStatus: null, alertMessage: null})
  }

  render() {
    const {alertStatus, alertMessage} = this.state;
    let alert = "";
    if (alertStatus) {
      alert = (
        <div className={`alert alert-dismissible ${alertStatus}`}>
          <button type="button" className="close" aria-label="Close" onClick={this.reset}><span aria-hidden="true"><i className="fa fa-times"></i></span></button>
          {alertMessage}
        </div>
      )
    }
    return (
      <div className="app-settings">
        {alert}
        <div className="reindex">
          <h3>Elasticsearch Reindex</h3>
          <p>This is dangerous and can take some time</p>
          <button className="btn btn-danger" onClick={this.onReindex}>Start</button>
        </div>
      </div>
    )
  }
}
