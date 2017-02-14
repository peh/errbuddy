'use strict';

import 'whatwg-fetch';
import BaseService from "./base-service";
const AppEvents = require('../events/application-events');
const PATH = '/api/app/users/';

export default class UserService extends BaseService {

  constructor(emitter, baseUrl) {
    super(emitter, baseUrl)
  }

  login(username, password) {
    return fetch(`${this.baseUrl}/api/app/login`, {
      method: 'POST',
      body: JSON.stringify({username: username, password: password})
    }).then((resp)=> {
      return resp.json()
    }).then((user)=> {
      return this._loggedIn(user)
    })
  }

  logout() {
    return new Promise((resolve, reject)=> {
      this._loggedOut();
      resolve()
    });
  }

  validate() {
    return fetch(this.getRequest(`${this.baseUrl}/api/app/validate`)).then((response)=> {
      return response.json()
    }).then((user)=> {
      return this._loggedIn(user)
    }).catch((err)=> {
      this._loggedOut();
      this.emitter.emit(AppEvents.LOGGED_OUT);
      throw(err)
    });
  }

  getUser(userId) {
    return fetch(this.getRequest(`${this.baseUrl}${PATH}${userId}`))
      .then((resp)=> {
        return resp.json()
      });
  }

  save(user) {
    let headers = this.getHeaders();
    headers.set('Content-Type', 'application/json');
    return fetch(`${this.baseUrl}${PATH}${user.id || ''}`, {
      headers: headers,
      method: user.id ? 'PUT' : 'POST',
      body: JSON.stringify(user)
    }).then((resp)=> {
      if (resp.status === 200) {
        return resp.json()
      } else {
        throw resp
      }
    })
  }

  del(user) {
    return fetch(this.getRequest(`${this.baseUrl}${PATH}${user.id}`, 'DELETE'))
      .then((resp)=> {
        return resp.json();
      });
  }

  list(max, offset) {
    return fetch(this.getRequest(`${this.baseUrl}${PATH}`)).then((resp)=> {
      return resp.json()
    })
  }

  _loggedIn(user) {
    this.configurationService.set('accessToken', user.access_token);
    return new Promise((resolve, reject)=> {
      fetch(this.getRequest(`${this.baseUrl}/api/app/me`))
        .then((response)=> {
          return response.json()
        })
        .then((json)=> {
          resolve(json.me)
        })
        .catch((err)=> {
          reject(err);
        });
    })
  }

  _loggedOut() {
    this.configurationService.set('accessToken', null)
  }

}
