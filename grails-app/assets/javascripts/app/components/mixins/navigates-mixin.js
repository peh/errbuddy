'use strict';

var ReactMiniRouter = require('react-mini-router')
var NavigatesMixin = {

  _navigate: (target, onylAddressBar)=> {
    ReactMiniRouter.navigate(target, onylAddressBar)
  }

};

module.exports = NavigatesMixin;
