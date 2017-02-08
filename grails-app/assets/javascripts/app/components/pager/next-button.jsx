'use strict';

var React = require('react');
var cx = require('classnames');

var NextButton = React.createClass({
  handleClick: function () {
    var current = this.props.current;
    var newPage = current < this.props.max ? current + 1 : this.props.max;
    this.props.pageChange(newPage);
  },

  render: function () {
    var classes = cx({
      'disabled': this.props.current == this.props.max
    });
    return (
      <li className={classes}>
        <a href="javascript: void(0);" aria-label="Previous" onClick={this.handleClick}>
          <i className="fa fa-caret-right" aria-hidden="true"></i>
        </a>
      </li>
    )
  }
});

module.exports = NextButton;
