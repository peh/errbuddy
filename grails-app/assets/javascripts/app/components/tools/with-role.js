import React from "react";
import * as _ from "lodash";

export default class WithRole extends React.Component {

  userHasAnyRole(user, roles) {
    if (!user) {
      console.error("userHasAnyRole was called without any 'me' set");
      return false;
    }
    return _.intersection(user.roles, roles).length > 0
  }

  render() {
    let user = this.props.user;
    let role = this.props.role;
    let roles = role ? [role] : this.props.roles;
    return this.userHasAnyRole(user, roles) ? this.props.children : "";
  }
}
