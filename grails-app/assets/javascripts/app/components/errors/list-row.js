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
    let newest = entryGroup.newest;
    let target = `/errors/${entryGroup.entryGroupId}/${newest.id}`
    if (e.metaKey || e.ctrlKey || e.which === 2) {
      window.open(target);
    } else {
      this.navigate(target);
    }
  }

  render() {
    let entryGroup = this.props.entryGroup;
    let newest = entryGroup.newest;

    let app = _.find(this.props.applications, a => {
      return entryGroup.application === a.id
    });

    if (!newest) {
      return <div />
    }

    // let message = "";
    let exception = newest.exception || newest.message
    let message = newest.exception ? newest.message : newest.stackTrace[0];
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
            <FromNow time={entryGroup.lastUpdated}/> @ {app ? app.name : newest.hostname}
          </div>
          <div className="similar-column">
            <SimilarPill entryGroup={entryGroup}/>
          </div>
        </div>
      </div>
    );
  }

}
