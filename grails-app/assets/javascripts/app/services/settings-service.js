'use strict';

import BaseService from "./base-service";

const PATH = '/api/app/settings/';

export default class SettingsService extends BaseService {

  constructor(emitter, baseUrl) {
    super(emitter, baseUrl);
  }

  reindex() {
    return this.doPostPut(`${this.baseUrl}${PATH}reindex`, {})
  }

};
