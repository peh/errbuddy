'use strict';

var React = require('react');

var NavbarItemText = React.createClass({

  render: function () {
    return (<span>{this.props.text}</span>)
  }
});

module.exports = NavbarItemText;
