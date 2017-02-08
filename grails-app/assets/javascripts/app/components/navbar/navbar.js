'use strict';

import React from "react";
import NavbarSearchForm from "./search-form";

export default class Navbar extends React.Component {

  render() {
    if (this.props.currentUser) {
      return (
        <div className="navbar navbar-default navbar-static-top" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                      data-target="#nav-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div id="nav-collapse" className="collapse navbar-collapse">
              <NavbarSearchForm errbuddyApp={this.props.errbuddyApp}/>
            </div>
          </div>
        </div>
      );
    } else {
      return (<div className="navbar navbar-default navbar-static-top" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <a href="#" className="navbar-brand">
              &nbsp;
            </a>
          </div>
        </div>
      </div>);
    }
  }

}

