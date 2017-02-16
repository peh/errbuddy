import React from "react";
import SimilarPill from "./common/similar-pill";
import FromNow from "../tools/from-now";
import BaseComponent from "../tools/base-component";
import * as  _ from "lodash";

export default class EntryGroupTableRow extends BaseComponent {

  constructor(props) {
    super(props)

    this._bindThis('onClick')
  }

  onClick(e) {
    let entryGroup = this.props.entryGroup;
    let latest = entryGroup.latest;
    let target = `/errors/${entryGroup.entryGroupId}/${latest.id}`;
    if (e.metaKey || e.ctrlKey || e.which === 2) {
      window.open(target);
    } else {
      this.navigate(target);
    }
  }

  render() {
    let entryGroup = this.props.entryGroup;
    let latest = entryGroup.latest;

    let app = _.find(this.props.applications, a => {
      return entryGroup.application === a.id
    });

    if (!latest) {
      return <div />
    }

    // let message = "";
    let exception = latest.exception || latest.message
    let message = latest.exception ? latest.message : latest.stackTrace[0];
    return (
      <div className="list-row" onClick={this.onClick}>
        <div className="body">
          <div className="main">
            {exception}
          </div>
          <div className="sub">
            {message}
          </div>
        </div>
        <div className="head">
          <div className="time">
            <FromNow time={entryGroup.lastUpdated}/> @ {app ? app.name : latest.hostname}
          </div>
          <div className="similar-column">
            <SimilarPill entryGroup={entryGroup}/>
          </div>
        </div>
      </div>
    );
  }

}
