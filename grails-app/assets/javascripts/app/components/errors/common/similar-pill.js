var cx = require('classnames');

import React from "react";

export default class SimilarPill extends React.Component {

  render() {
    var entryGroup = this.props.entryGroup;
    var similarClasses = cx(
      'similar', {
        danger: entryGroup.entries > 25
      }, {
        warn: entryGroup.entries <= 25 && entryGroup.entries > 3
      }, {
        okay: entryGroup.entries <= 3
      },
      this.props.classNames
    )

    return (<span className={similarClasses}>{entryGroup.entries}</span>);
  }

}

