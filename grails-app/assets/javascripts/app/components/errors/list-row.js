import React from "react";
import SimilarPill from "./common/similar-pill";
import FromNow from "../tools/from-now";
import BaseComponent from "../tools/base-component";
import * as  _ from "lodash";

export default class EntryGroupTableRow extends BaseComponent {

  constructor(props) {
    super(props)
  }

  render() {
    let entryGroup = this.props.entryGroup;
    let newest = entryGroup.newest;

    let app = _.find(this.props.applications, a=> {
      return entryGroup.application === a.id
    });

    if (!newest) {
      return <div />
    }

    let message = "";
    if (!newest.exception) {
      message = (<div className="sub">{newest.message}</div>)
    }
    return (
      <div className="list-row" onClick={()=> {
        this.navigate(`/errors/${entryGroup.entryGroupId}/${newest.id}`)
      }}>
        <div className="body">
          <div className="main">
            {newest.exception || newest.message}
          </div>

            {message}
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
