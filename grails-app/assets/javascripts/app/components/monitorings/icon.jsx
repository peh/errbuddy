'use strict';

import React from "react";
var cx = require('classnames');

var MonitoringIcon = React.createClass({

  render: function () {
    var classes = cx('fa', {
      'fa-server': this.props.type === 'SERVER',
      'fa-globe': this.props.type === 'SERVICE'
    })
    return (<i className={classes}></i>)
  }
});
module.exports = MonitoringIcon;
