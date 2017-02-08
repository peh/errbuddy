'use strict'

var React = require('react');
var ReactMiniRouter = require('react-mini-router');
var NextButton = require('./next-button.jsx');
var PageButton = require('./page-button.jsx');
var PrevButton = require('./prev-button.jsx');
var AppEvents = require('../../events/application-events');

var Pager = React.createClass({

  _page: 1,

  toPage: function (page) {
    emitter.emit(AppEvents.PAGE_CHANGED, page);
    ReactMiniRouter.navigate(this.props.pathPrefix + '' + page, true);
  },

  getInitialState: function () {
    return {
      current: this._page
    }
  },

  render: function () {
    var start = 1;
    if (this.props.pages > 10) {
      start = this.props.current - 3;
      if (start < 1) {
        start = 1
      }
    }
    var pages = [<PrevButton ref="prev-button" current={this.props.current} max={this.props.pages}
                             pageChange={this.toPage} key="prev"/>];
    if (start > 1) {
      pages.push(<PageButton key={1} page={1} current={this.props.current} pageChange={this.toPage}/>);
      pages.push(<li className="disabled" key="points">
        <a href="javascript: void(0);" aria-label="...">
          <span aria-hidden="true">...</span>
        </a>
      </li>)
    }
    var end = 1;
    for (var i = start; i <= this.props.pages && i <= start + 7; i++) {
      pages.push(<PageButton key={i} page={i} current={this.props.current} pageChange={this.toPage}/>);
      end = i;
    }
    if (end < this.props.pages) {
      if (end < this.props.pages - 1) {
        pages.push(<li className="disabled" key="points-2">
          <a href="javascript: void(0);" aria-label="...">
            <span aria-hidden="true">...</span>
          </a>
        </li>);
      }
      pages.push(<PageButton key={this.props.pages} page={this.props.pages} current={this.props.current}
                             pageChange={this.toPage}/>)
    }
    pages.push(<NextButton current={this.props.current} max={this.props.pages} pageChange={this.toPage} key="next"/>);
    return (
      <ul className="pagination pull-right">
        {pages}
      </ul>
    )
  }

});

module.exports = Pager;
