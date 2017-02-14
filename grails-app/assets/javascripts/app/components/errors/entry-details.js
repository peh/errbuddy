const swal = require('sweetalert');
const querystring = require('querystring');
const cx = require('classnames')
import * as  _ from "lodash";
import ObjectDL from "../tools/object-dl";
import SimilarPill from "./common/similar-pill";
import EntryDeleteButton from "./entry-delete-button";
import EntryResolveButton from "./entry-resolve-button";
import EntryReportButton from "./entry-report-button";
import EntryHistogram from "./entry-histogram";
import FormatedDate from "../tools/formated-date";
import EntryDetailsTable from "./details-table";
import LoadingHero from "../tools/loading-hero";
import BaseComponent from "../tools/base-component";
import React from "react";

export default class EntryDetails extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      entryGroup: {},
      entry: {},
      similar: [],
      total: 0,
    };

    this._bindThis('loadEntryGroup', 'onReportClicked', 'onDeleteClicked', 'onResolveClicked', 'changePage', 'getMax', 'loadSimilar', 'getOffset')
  }

  loadEntryGroup(props) {
    const {entryGroupId, entryId} = props || this.props;
    this.getErrorService().get(entryGroupId, entryId)
      .then(json=> {
        const {entryGroup, entry} = json;
        this.setState(_.assign(this.state, {entryGroup, entry}), this.loadSimilar);
      })
  }

  loadSimilar(props) {
    let offset = _.get(props, 'offset') || this.getOffset();
    let max = _.get(props, 'max') || this.getMax();

    this.getErrorService().similar(this.state.entryGroup, {max, offset}).then(json=> {
      this.setState({
        similar: json.similar,
        total: json.total
      })
    });
  }

  onResolveClicked() {
    this.getErrorService().resolve(this.state.entryGroup).then(()=> {
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
      ()=> {
        this.getErrorService().del(entryGroup);
        swal({
          title: 'Started',
          text: 'A background Job was started which handles the deletion. This can take a few minutes depending on how many Errors have to be deleted.',
          type: 'success'
        }, ()=> {
          this.navigate('/errors/')
        })
      });
  }

  onReportClicked() {

  }

  _goto(e) {
    $('html, body').animate({
      scrollTop: $(e.target.hash).offset().top + 60
    }, 500);
  }

  _scrollSpy() {

    let fromTop = $(window).scrollTop() + $('#info').offset().top;
    if (fromTop > 1) {
      $('.details-head').addClass('sticky');
    } else {
      $('.details-head').removeClass('sticky');
    }
    let sections = $('section').map(function () {
      let $self = $(this);
      let selfTop = $self.offset().top - fromTop + $self.height();
      if (selfTop > 0)
        return {
          id: $self.prop('id'),
          top: selfTop
        };
      else
        return null
    });
    let topMost = _.min(sections, function (section) {
      return section.top;
    }).id;
    $('ul.details-nav > li').removeClass('active');
    $('ul.details-nav').find(`a[href='#${topMost}']`).parent().addClass('active');
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
    $(window).on('scroll', this._scrollSpy);
    this.loadEntryGroup();
  }

  componentWillUnmount() {
    $(window).off('scroll', this._scrollSpy)
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
        stacktraces.push(<li key={'stacktrace-' + i}>at {traces[i]}</li>)
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
      <div id="details-wrap">
        <div className="details-head">
          <h3>
            {entry.exception || entry.message}
            <small>{message}</small>
          </h3>
          {resolved}
          <ul className="details-nav">
            <li className="active">
              <a onClick={this._goto} href="#info">
                Info
              </a>
            </li>
            <li>
              <a onClick={this._goto} href="#actions">
                Actions
              </a>
            </li>
            <li>
              <a onClick={this._goto} href="#histogram">
                Histogram
              </a>
            </li>
            <li>
              <a onClick={this._goto} href="#stacktrace">
                Stacktrace
              </a>
            </li>
            <li>
              <a onClick={this._goto} href="#parameter">
                Parameter
              </a>
            </li>
            <li>
              <a onClick={this._goto} href="#similar">
                Similar
              </a>
            </li>
          </ul>
          <span className="pull-right"><SimilarPill entryGroup={entryGroup} classNames="details-pill"/></span>
        </div>

        <div className="row details-body">
          <div className="col-sm-12">
            <section id="info">
              <div className="row">
                <div className="col-sm-12">
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
                </div>
              </div>
            </section>
            <section id="actions">
              <div className="row">
                <div className="col-sm-12">
                  <h3>Actions</h3>
                  <EntryResolveButton entryGroup={entryGroup} withText={true} onClick={this.onResolveClicked}/>
                  <EntryDeleteButton entryGroup={entryGroup} withText={true} onClick={this.onDeleteClicked}/>
                  {/*<EntryReportButton entryGroup={entryGroup} withText={true} onClick={this.onReportClicked}/>*/}
                </div>
              </div>
            </section>
            <section id="histogram">
              <h3>Histogram</h3>
              <div className="row">
                <div className="col-sm-12">
                  <EntryHistogram entryGroup={entryGroup} errbuddyApp={errbuddyApp}/>
                </div>
              </div>
            </section>
            <section id="stacktrace">
              <div className="row">
                <div className="col-sm-12">
                  <h3>
                    Stacktrace
                  </h3>
                  <ul className="list-unstyled">
                    {stacktraces}
                  </ul>
                </div>
              </div>
            </section>
            <section id="parameter">
              <div className="row">
                <div className="col-sm-6">
                  <h3>
                    Session Parameters
                  </h3>
                  <ObjectDL obj={entry.sessionParameters}/>
                </div>
                <div className="col-sm-6">
                  <h3>
                    Request Parameters
                  </h3>
                  <ObjectDL obj={entry.requestParameters}/>
                </div>
              </div>
            </section>
            <section id="similar">
              <div className="row">
                <div className="col-sm-12">
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
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }

}

