'use strict';

import BaseService from "./base-service";

const PATH = '/api/app/applications/';

export default class ApplicationService extends BaseService {

  constructor(emitter, baseUrl) {
    super(emitter, baseUrl);
  }

  list(offset, max) {
    return this.doGet(`${this.baseUrl}${PATH}`, {max: max, offset: offset});
  }

  get(id) {
    return this.doGet(`${this.baseUrl}${PATH}${id}`);
  }

  save(application) {
    return this.doPostPut(`${this.baseUrl}${PATH}`, application);
  }

  clear(application) {
    return this.doPostPut(`${this.baseUrl}${PATH}${application.id}/clear`, {});
  }

  del(application) {
    return this.doDel(`${this.baseUrl}${PATH}${application.id}`);
  }
}
