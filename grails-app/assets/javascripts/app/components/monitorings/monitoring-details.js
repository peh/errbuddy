'use strict';

var Icon = require('./icon.jsx');
var swal = require('sweetalert');

import React from "react";
import LoadingHero from "../tools/loading-hero";
import ServiceChecksList from "./service-checks-list";
import ServiceForm from "./service-form";
import ServerForm from "./server-form";
import BaseComponent from "../tools/base-component";

export default class MonitoringDetails extends BaseComponent {

  constructor(props) {
    super(props)


    this.state = {
      monitoring: {
        type: (props.type || "server").toUpperCase()
      },
      errors: [],
      saved: false,
      dirty: false
    }

    this._bindThis('onValueChange', 'onDelete', 'onSave', 'loadObjectFromServer')
    if (props.id > 0) {
      this.loadObjectFromServer();
    }
  }

  loadObjectFromServer() {
    this.getMonitoringService().get(this.props.id).then((json) => {
      this.setState(_.assign(this.state, {
        monitoring: json.monitoring
      }))
    })
  }

  onSave(e) {
    e.preventDefault();
    let monitoring = this.state.monitoring;
    if (monitoring.enabled === undefined) {
      monitoring.enabled = false
    }
    this.getMonitoringService().save(monitoring);
  }

  onDelete() {
    swal({
        title: 'Are you sure you want to delete this?',
        text: 'This action cannot be undone',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No!',
      }, ()=> {
        this.getMonitoringService().del(this.state.monitoring).then(()=> {
          this.navigate("/monitorings/")
        })
      }
    )
  }

  onValueChange(field, value) {
    this.state.monitoring[field] = value
    this.state.dirty = true
    this.setState(this.state)
  }

  render() {
    // initial loading
    const {monitoring, errors, dirty, saved} = this.state;
    if (this.props.id > 0 && !monitoring.id) {
      return (
        <LoadingHero />
      );
    }
    let form = ''
    let type = ''
    let hostString = null

    if (monitoring.type === 'SERVER') {
      form = <ServerForm server={monitoring} onDelete={this.onDelete} onSave={this.onSave} onValueChange={this.onValueChange} errors={errors}
                         saved={saved} dirty={dirty}/>
      type = 'Server'
      hostString = monitoring.hostname

    } else if (monitoring.type === 'SERVICE') {
      form = <ServiceForm service={monitoring} onDelete={this.onDelete} onSave={this.onSave} onValueChange={this.onValueChange} errors={errors}
                          saved={saved} dirty={dirty}/>
      type = 'Service'
      hostString = monitoring.url
    }

    let checksRow = ""
    if (monitoring.id) {
      checksRow = (<div className="row">
        <div className="col-sm-12">
          <ServiceChecksList monitoring={monitoring} errbuddyApp={this.props.errbuddyApp}/>
        </div>
      </div>)
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <h2><Icon type={monitoring.type}/>&nbsp;{monitoring.name || type}&nbsp;
              <small> ({hostString || 'Add a new ' + type})</small>
            </h2>
            {form}
          </div>
        </div>
        <hr/>
        {checksRow}
      </div>
    )
  }

}
