import React from "react";
const cx = require('classnames');

export default class EntryDeleteButton extends React.Component {

  // _handleClick: function () {
  //   swal({
  //       title: 'You are about to delete this Error group',
  //       text: 'This includes all ' + this.props.entryGroup.entries + ' similar Errors. Are you sure you want to do that?',
  //       type: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes',
  //       cancelButtonText: 'No!',
  //       closeOnConfirm: false
  //     },
  //     function () {
  //       EntryGroupService.del(this.props.entryGroup);
  //       swal({
  //         title: 'Started',
  //         text: 'A background Job was started which handles the deletion. This can take a few minutes depending on how many Errors have to be deleted.',
  //         type: 'success'
  //       })
  //     }.bind(this));
  // },

  render() {
    var classes = cx('btn', 'btn-errbuddy', 'delete');
    var text = '';
    if (this.props.withText === true) {
      text = (<span>  Delete</span>)
    }
    return (
      <button className={classes} onClick={this.props.onClick}>
        <i className="fa fa-trash"></i>{text}
      </button>
    );
  }

}
