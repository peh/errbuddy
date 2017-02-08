'use strict';

var AppEvents = require('../events/application-events');
var LocalStore = require('../tools/local-storage');
import _ from "lodash";
import BaseService from "./base-service";
const querystring = require('querystring');

const PATH = '/api/app/applications/';

export default class ApplicationService extends BaseService {

  constructor(emitter, baseUrl) {
    super(emitter, baseUrl);
  }

  list(offset, max) {
    return fetch(`${this.baseUrl}${PATH}?${querystring.stringify({max: max, offset: offset})}`, {
      headers: this.getHeaders()
    }).then((resp)=> {
      return resp.json()
    })
  }

  get(id) {
    return fetch(`${this.baseUrl}${PATH}${id}`, {
      headers: this.getHeaders()
    }).then((resp)=> {
      return resp.json()
    });
  }

  save(application) {
    let headers = this.getHeaders();
    headers.set('Content-Type', 'application/json');
    return fetch(`${this.baseUrl}${PATH}${application.id || ''}`, {
      headers: headers,
      method: application.id ? 'PUT' : 'POST',
      body: JSON.stringify(application)
    }).then((resp)=> {
      return resp.json()
    })
  }

  clear(application) {
    return fetch(this.getRequest(`${this.baseUrl}${PATH}${application.id}/clear`, 'POST'))
      .then((resp)=> {
        return resp.json();
      });
  }

  del(application) {
    return fetch(this.getRequest(`${this.baseUrl}${PATH}${application.id}`, 'DELETE'))
      .then((resp)=> {
        return resp.json();
      });
  }
};
