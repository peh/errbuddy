const cx = require('classnames')

import React from "react";
import Icon from "./icon";

export default class SubmitButton extends React.Component {

  render() {

    let classes = cx('btn', 'btn-default', 'btn-md', this.props.classes || {});
    return (
      <button type="submit" className={classes}>
        <Icon icon="floppy-o">Save</Icon>
      </button>
    );
  }

}
