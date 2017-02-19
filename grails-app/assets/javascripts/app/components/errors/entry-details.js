const swal = require('sweetalert');
const querystring = require('querystring');
import * as  _ from "lodash";
import EntryRefindButton from "./entry-refind-button";
import ObjectDL from "../tools/object-dl";
import SimilarPill from "./common/similar-pill";
import EntryDeleteButton from "./entry-delete-button";
import EntryResolveButton from "./entry-resolve-button";
import EntryHistogram from "./entry-histogram";
import FormatedDate from "../tools/formated-date";
import EntryDetailsTable from "./details-table";
import LoadingHero from "../tools/loading-hero";
import BaseComponent from "../tools/base-component";
import React from "react";
const stacktraceFilter = [
  // "org.codehaus.groovy.runtime",
  // "sun.reflect",
  // "java.lang.reflect",
  // "org.codehaus.groovy.reflection",
  // "groovy.lang",
  // "grails.util.Environment",
  // "org.springframework",
  // "org.springsource",
  // "org.apache",
  // "javax"
]
export default class EntryDetails extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      entryGroup: {},
      entry: {},
      similar: [],
      total: 0,
      refindSwal: ""
    };

    this._bindThis('loadEntryGroup', 'onReportClicked', 'onDeleteClicked', 'onResolveClicked', 'changePage', 'getMax', 'loadSimilar', 'getOffset', 'onRefindClicked')

  }

  loadEntryGroup(props) {
    const {entryGroupId, entryId} = props || this.props;
    this.getErrorService().get(entryGroupId, entryId)
      .then(json => {
        const {entryGroup, entry} = json;
        this.setState(_.assign(this.state, {entryGroup, entry}), this.loadSimilar);
      })
  }

  loadSimilar(props) {
    let offset = _.get(props, 'offset') || this.getOffset();
    let max = _.get(props, 'max') || this.getMax();

    this.getErrorService().similar(this.state.entryGroup, {max, offset}).then(json => {
      this.setState({
        similar: json.similar,
        total: json.total
      })
    });
  }

  onRefindClicked() {

    swal({
        title: 'You are about to delete this Error group',
        text: `All Items of this group will be rechecked for similar objects`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No!',
        closeOnConfirm: false
      },
      () => {
        this.getErrorService().refind(this.state.entryGroup);
        swal({
          title: 'Started',
          text: 'A background Job was started.',
          type: 'success'
        }, () => {
          this.navigate('/')
        })
      });
  }

  onResolveClicked() {
    this.getErrorService().resolve(this.state.entryGroup).then(() => {
      this.loadEntryGroup();
    });
  }

  onDeleteClicked() {
    const {entryGroup} = this.state;
    swal({
        title: 'You are about to delete this Error group',
        text: 'This includes all ' + entryGroup.entries + ' similar Errors. Are you sure you want to do that?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No!',
        closeOnConfirm: false
      },
      () => {
        this.getErrorService().del(entryGroup);
        swal({
          title: 'Started',
          text: 'A background Job was started which handles the deletion. This can take a few minutes depending on how many Errors have to be deleted.',
          type: 'success'
        }, () => {
          this.navigate('/')
        })
      });
  }

  onReportClicked() {

  }

  componentWillReceiveProps(newProps) {
    const {entryGroup, entry} = this.state;
    if (newProps.entryGroupId !== _.get(entryGroup, "entryGroupId") || newProps.entryId !== `${_.get(entry, 'id')}`) {
      this.loadEntryGroup(newProps)
    } else if (_.get(newProps.urlParameters, 'offset') !== `${this.getOffset()}`) {
      this.loadSimilar(newProps.urlParameters)
    }
  }

  componentDidMount() {
    this.loadEntryGroup();
  }

  changePage(pageObj) {
    const {entryGroupId, entryId} = this.props;
    let max = this.getMax();
    let offset = pageObj.selected * max;
    this.navigate(`/errors/${entryGroupId}/${entryId}?${querystring.stringify({max, offset})}`);
  }

  render() {
    let {entryGroup, entry, similar, total} = this.state;
    let max = this.getMax();
    let offset = this.getOffset();
    if (!_.get(entryGroup, "entryGroupId", false) || !_.get(entry, "id", false)) {
      return <LoadingHero/>
    }
    let stacktraces = [];
    if (entry.stackTrace) {
      let traces = _.clone(entry.stackTrace)
      if (entry.exception) {
        stacktraces.push(<li key={'stacktrace-root'} className="bold">{entry.exception}: {entry.message}</li>)
      } else {
        stacktraces.push(<li key={'stacktrace-root'} className="bold">{traces.shift()}</li>)
      }
      for (let i = 0; i < traces.length; i++) {
        let trace = traces[i];
        if (trace && _.findIndex(stacktraceFilter, (s) => {
            return trace.startsWith(s)
          }) == -1){
          stacktraces.push(<li key={'stacktrace-' + i}>at {traces[i]}</li>)
        }
      }
    }

    let message = (<span>{entry.message}</span>);
    if (!entry.exception) {
      message = '';
    }
    let resolved = '';
    if (entryGroup.resolved === true) {
      resolved = (<h6 className="resolved"><i className="fa fa-check"></i> Resolved by {entryGroup.resolvedBy} at <FormatedDate time={entryGroup.resolveDate}/></h6>);
    }

    return (
      <div className="entry-details">
        <section id="head">
          <h3>
            {entry.exception || entry.message}
            <small>{message}</small>
          </h3>
          {resolved}
          {/*details-nav*/}
          <span className="pull-right"><SimilarPill entryGroup={entryGroup} classNames="details-pill"/></span>
        </section>
        <section id="info">
          <h3>Infos</h3>
          <dl className="dl-horizontal">
            <dt>
              First Occurence
            </dt>
            <dd>
              <FormatedDate time={entryGroup.dateCreated}/>
            </dd>
            <dt>
              Last Occurence
            </dt>
            <dd>
              <FormatedDate time={entryGroup.lastUpdated}/>
            </dd>
            <dt>
              This Occurence
            </dt>
            <dd>
              <FormatedDate time={entry.time}/>
            </dd>
            <dt>
              Controller
            </dt>
            <dd>{entry.controllerName}</dd>
            <dt>
              Action
            </dt>
            <dd>{entry.actionName}</dd>
            <dt>
              Service
            </dt>
            <dd>{entry.serviceName}</dd>
            <dt>
              Path
            </dt>
            <dd>{entry.path}</dd>
            <dt>
              Hostname
            </dt>
            <dd>{entry.hostname}</dd>
          </dl>
        </section>
        <section id="actions">
          <h3>Actions</h3>
          <div>
            <EntryResolveButton entryGroup={entryGroup} onClick={this.onResolveClicked}/>
            {/*<span>Mark this Group as resolved so it will not be shown in the list anymore.</span>*/}
          </div>
          <div>
            <EntryDeleteButton onClick={this.onDeleteClicked}/>
            {/*<span>Delete this Group</span>*/}
          </div>
          <div>
            <EntryRefindButton onClick={this.onRefindClicked}/>
            {/*<span>Waaaas?</span>*/}
          </div>
          {this.state.refindSwal}
          {/*<EntryReportButton entryGroup={entryGroup} withText={true} onClick={this.onReportClicked}/>*/}
        </section>
        <section id="histogram" className="entry-historgram">
          <h3>Histogram</h3>
          <EntryHistogram entryGroup={entryGroup} errbuddyApp={errbuddyApp}/>
        </section>
        <section id="stacktrace">
          <h3>
            Stacktrace
          </h3>
          <ul className="list-unstyled">
            {stacktraces}
          </ul>
        </section>
        <section id="session-parameter">
          <h3>
            Session Parameters
          </h3>
          <ObjectDL obj={entry.sessionParameters}/>
        </section>
        <section id="request-parameter">
          <h3>
            Request Parameters
          </h3>
          <ObjectDL obj={entry.requestParameters}/>
        </section>
        <section id="similar">
          <h3>
            Similar
          </h3>
          <EntryDetailsTable
            entry={entry}
            entryGroup={entryGroup}
            list={similar}
            max={max}
            total={total}
            offset={offset}
            changePage={this.changePage}
            errbuddyApp={this.props.errbuddyApp}/>
        </section>
      </div>
    )
  }

}

