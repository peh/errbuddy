'use strict';

var React = require('react');
var cx = require('classnames');

var PageButton = React.createClass({
  handleClick: function () {
    this.props.pageChange(this.props.page);
  },

  render: function () {
    var classes = cx({
      'active': this.props.page == this.props.current
    });
    return (
      <li className={classes}>
        <a href="javascript: void(0);" aria-label="Previous" onClick={this.handleClick}>
          <span aria-hidden="true">{this.props.page}</span>
        </a>
      </li>
    )
  }
});

module.exports = PageButton;
