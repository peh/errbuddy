'use strict';

import BaseService from "./base-service";
const PATH = '/api/app/entries/';


export default class ErrorService extends BaseService {
  constructor(emitter, baseUrl) {
    super(emitter, baseUrl);
  }

  list(max, offset, query, application) {
    return fetch(this.getRequest(`${this.buildPath()}?${this.createQueryString({offset: offset || 0, max: max || 20, query: query, applications: application})}`))
      .then((resp) => {
        return resp.json()
      })
  }

  get(entryGroupId, entryId) {
    return fetch(this.getRequest(`${this.buildPath(entryGroupId)}/${entryId}`))
      .then((resp) => {
        return resp.json()
      })
  }

  similar(entryGroup, params) {
    let q = this.createQueryString(params);
    return fetch(this.getRequest(`${this.buildPath(entryGroup.entryGroupId)}/similar?${q}`))
      .then((resp) => {
        return resp.json()
      });
  }

  resolve(entryGroup) {
    return fetch(this.getRequest(`${this.buildPath(entryGroup.entryGroupId)}/resolve`))
      .then((resp) => {
        return resp.json()
      });
  }

  del(entryGroup) {
    let headers = this.getHeaders();
    headers.set('Content-Type', 'application/json');
    return fetch(`${this.buildPath(entryGroup.entryGroupId)}`, {
      headers: headers,
      method: 'DELETE'
    }).then((resp) => {
      return resp.json()
    });
  }

  refind(entryGroup) {
    return fetch(this.getRequest(`${this.buildPath(entryGroup.entryGroupId)}/refind`))
      .then((resp) => {
        return resp.json()
      });
  }

  buildPath(entryGroupId) {
    return `${this.baseUrl}${PATH}${entryGroupId || ''}`
  }

  histogram(entryGroup) {
    return fetch(this.getRequest(`${this.buildPath(entryGroup.entryGroupId)}/histogram`))
      .then((resp) => {
        return resp.json()
      });
  }

}
