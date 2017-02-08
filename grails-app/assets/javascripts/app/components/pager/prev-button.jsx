'use strict';

var React = require('react');
var cx = require('classnames')
var PrevButton = React.createClass({
  handleClick: function () {
    var current = this.props.current;
    var newPage = current > 1 ? current - 1 : 1;
    this.props.pageChange(newPage);
  },

  render: function () {
    var classes = cx({
      'disabled': this.props.current == 1
    });
    return (
      <li className={classes}>
        <a href="javascript: void(0);" aria-label="Previous" onClick={this.handleClick}>
          <i className="fa fa-caret-left" aria-hidden="true"></i>
        </a>
      </li>
    )
  }
});

module.exports = PrevButton;
