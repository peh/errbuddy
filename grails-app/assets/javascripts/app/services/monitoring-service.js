'use strict';

import BaseService from "./base-service";
const PATH = '/api/app/monitorings/';

export default class MonitoringService extends BaseService {

  buildPath(id) {
    return `${this.baseUrl}${PATH}${id || ''}`
  }

  get(id) {
    return this.doGet(this.buildPath(id))
  }

  list(listParams) {
    let params = {
      sort: 'name',
      order: 'asc'
    };
    params.offset = listParams.offset || 0;
    params.max = listParams.max || 20;
    params.showDisabled = listParams.showDisabled || false;
    if (listParams.type)
      params.type = listParams.type;
    if (listParams.status)
      params.status = listParams.status;

    return this.doGet(this.buildPath(), params)
  }

  stats() {
    return this.doGet(`${this.buildPath()}/checks`);
  }

  checks(monitoring, listParams) {
    let params = {
      sort: 'dateCreated',
      order: 'desc'
    };
    params.offset = listParams.offset || 0;
    params.max = listParams.max || 20;
    return this.doGet(`${this.buildPath(monitoring.id)}/checks`);
  }

  save(monitoring) {
    this.doPostPut(this.buildPath(), monitoring)
  }

  del(monitoring) {
    return this.doDel(this.buildPath(monitoring.id));
  }
}
