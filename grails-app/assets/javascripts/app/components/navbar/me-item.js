import React from "react";
var NavbarItemText = require('./item-text.jsx');
var navigate = require('react-mini-router').navigate;
var cx = require('classnames');

export default class MeItem extends React.Component {

  render() {
    var classes = cx('item', {
      'active': this.props.currentAction == 'users'
    });
    return (
      <a className={classes} onClick={() => {
        navigate('/users/' + this.props.currentUser.id)
      }}>
        <i className="fa fa-user"></i>
      </a>
    )
  }

}
