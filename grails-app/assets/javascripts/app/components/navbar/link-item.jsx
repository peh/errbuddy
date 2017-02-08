'use strict';

var React = require('react');
var NavbarItemText = require('./item-text.jsx');

var NavbarLink = React.createClass({
  render: function () {
    var iconClass = 'fa fa-' + this.props.icon;
    return (
      <li>
        <a href={this.props.link} target="_blank">
          <i className={iconClass}></i><NavbarItemText text={this.props.text}/>
        </a>
      </li>
    )
  }
});

module.exports = NavbarLink;
