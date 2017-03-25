var cx = require('classnames');
let ApplicationService = require('../../services/application-service.js');
let AppEvents = require('../../events/application-events.js');
import React from "react";
import WithRole from "../tools/with-role";
import TriggerPauseItem from "./pause-item";
import NavbarItem from "./item";
import BaseComponent from "../tools/base-component";
import MeItem from "./me-item";
import LogoutItem from "./logout-item";


export default class Sidebar extends BaseComponent {

  constructor(props) {
    super(props);

    this._interval = -1;
    this.state = {
      expanded: false,
    }
  }

  _onStatsDidUpdate(stats) {
    let result = false;
    if ((stats.YELLOW !== undefined && stats.YELLOW > 0) || (stats.RED !== undefined && stats.RED > 0)) {
      result = true
    }
    this.setState(this.state)
  }

  componentDidMount() {
    // this._interval = setInterval(()=>{
    // }, 5000)
    this.getEmitter().on(AppEvents.SELECTED_APP_CHANGED, this._selectedAppChanged)
  }

  componentWillUnmount() {
    this.getEmitter().removeListener(AppEvents.SELECTED_APP_CHANGED, this._selectedAppChanged)
    clearInterval(this._interval)
  }

  render() {
    var sideBarClasses = cx('sidebar', 'hidden-sm', 'hidden-xs', {
      expanded: this.state.expanded
    });
    if (!this.props.currentUser) {
      return (
        <div className={sideBarClasses}>
          <ul className="side-nav pull-up">
          </ul>
          <ul className="side-nav pull-down">
            <li>
              <a href="#">
                <i className="fa fa-heart"></i>
                <span>Thank you! For using errbuddy!</span>
              </a>
            </li>
          </ul>
        </div>
      )
    }

    return (
      <div className={sideBarClasses}>
        <ul className="side-nav">
          <NavbarItem currentAction={this.props.action} errbuddyApp={this.getApp()} text="Errors" icon="list-alt" action="errors" path="/"/>
          <NavbarItem currentAction={this.props.action} errbuddyApp={this.getApp()} text="Applications" icon="ship" action="applications" path="/applications"/>
          <NavbarItem currentAction={this.props.action} errbuddyApp={this.getApp()} text="Users" icon="users" action="users" path="/users" roleNeeded={['ROLE_ROOT', 'ROLE_ADMIN']}/>
        </ul>
        <ul className="side-nav">
          <WithRole user={this.getMe()} role="ROLE_ROOT">
            <NavbarItem currentAction={this.props.action} errbuddyApp={this.getApp()} text="Settings" icon="cogs" action="settings" path="/settings"/>
          </WithRole>
          <TriggerPauseItem errbuddyApp={this.getApp()} onClick={() => {
            this.props.onPauseChange(!this.props.paused)
          }} paused={this.props.paused}/>
          <MeItem currentUser={this.props.currentUser}/>
          <li>
            <a href="#">
              <i className="fa fa-heart"></i>
              <span>Thank you! For using errbuddy!</span>
            </a>
          </li>
          <LogoutItem errbuddyApp={this.getApp()}/>
        </ul>
      </div>
    );
  }

}
