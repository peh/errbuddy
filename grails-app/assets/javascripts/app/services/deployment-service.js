import BaseService from "./base-service";
const querystring = require('querystring')

export default class DeploymentService extends BaseService {

  constructor(emitter, baseUrl) {
    super(emitter, baseUrl)
  }

  list(appId, params, success, error) {
    var data = {
      max: params.max || 20,
      offset: params.offset || 0,
      sort: params.sort || 'id',
      order: params.order || 'desc'
    };
    return fetch(this.getRequest(`${this.baseUrl}/api/app/applications/${appId}/deployments?${querystring.stringify(data)}`))
      .then((resp)=> {
        return resp.json()
      })
  }


}
