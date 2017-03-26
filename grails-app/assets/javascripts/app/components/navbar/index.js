import React from "react";
import BaseComponent from "../tools/base-component";
import NavItem from "./item";
import NavbarSearchForm from "./search-form";
import WithRole from "../tools/with-role";
import TriggerPauseItem from "./pause-item";
import LogoutItem from "./logout-item";
import MeItem from "./me-item";

export default class Nav extends BaseComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="nav">
        <div className="left">
          <NavItem currentAction={this.props.action} errbuddyApp={this.getApp()} text="Errors" icon="list-alt" action="errors" path="/"/>
          <NavItem currentAction={this.props.action} errbuddyApp={this.getApp()} text="Applications" icon="ship" action="applications" path="/applications"/>
          <NavItem currentAction={this.props.action} errbuddyApp={this.getApp()} text="Users" icon="users" action="users" path="/users" roleNeeded={['ROLE_ROOT', 'ROLE_ADMIN']}/>
        </div>
        <div className="search">
          <NavbarSearchForm errbuddyApp={this.props.errbuddyApp} urlParameters={this.props.urlParameters}/>
        </div>
        <div className="right">
          <TriggerPauseItem
            errbuddyApp={this.getApp()}
            onClick={() => {
              this.props.onPauseChange(!this.props.paused)
            }}
            paused={this.props.paused}/>
          <WithRole user={this.getMe()} role="ROLE_ROOT">
            <NavItem currentAction={this.props.action} errbuddyApp={this.getApp()} icon="cogs" action="settings" path="/settings"/>
          </WithRole>
          <MeItem currentUser={this.getMe()}/>
          <LogoutItem errbuddyApp={this.getApp()}/>
        </div>
      </div>
    )
  }
}
