import ConfigurationService from "./configuration-service";
const querystring = require('querystring')

export default class BaseService {
  constructor(emitter, baseUrl) {
    if (!emitter) {
      throw(`${this.constructor.name} was initialized without an emitter`)
    }

    if (!baseUrl) {
      throw(`${this.constructor.name} was initialized without a baseUrl`)
    }

    this.emitter = emitter;
    this.baseUrl = baseUrl;
  }

  getRequest(url, method, body) {
    let headers = this.getHeaders();
    if (method === 'POST' || method === 'PUT') {
      headers.set('Content-Type', 'application/json')
    }
    return new Request(url, {
      method: method || 'GET',
      headers: headers,
      body: body
    });
  }

  doGet(url, query) {
    let reqUrl = url;
    if (query) {
      reqUrl = `${url}?${querystring.stringify(query)}`
    }
    return fetch(this.getRequest(reqUrl)).then(resp=> {
      return resp.json()
    })
  }

  doPostPut(url, obj) {
    let headers = this.getHeaders();
    headers.set('Content-Type', 'application/json');
    return fetch(`${url}${obj.id || ''}`, {
      headers: headers,
      method: obj.id ? 'PUT' : 'POST',
      body: JSON.stringify(obj)
    }).then((resp)=> {
      return resp.json()
    })
  }

  doDel(url) {
    return fetch(`${url}`, {
      headers: headers,
      method: 'DELETE'
    }).then((resp)=> {
      return resp.json()
    })
  }

  getHeaders() {
    return new Headers({
      Authorization: `Bearer:${ConfigurationService.get('accessToken')}`,
      Accept: 'application/json'
    });
  }

  createQueryString(queryObject) {
    return querystring.stringify(queryObject)
  }

  set me(user) {
    this._me = user
  }

  get me() {
    return this._me
  }

  set baseUrl(url) {
    this._baseUrl = url
  }

  get baseUrl() {
    return this._baseUrl
  }
}
