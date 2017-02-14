/* globals localStorage */
const INSTANCE = null;

export default class ConfigurationService {
  constructor() {
    if (INSTANCE === null) {
      let fromStore = localStorage.getItem('errbuddy.config')
      if (fromStore) {
        this._config = JSON.parse(fromStore)
      } else {
        this._config = {}
      }
    }
    return INSTANCE;
  }

  get(key) {
    return this._config[key]
  }

  set(key, value) {
    this._config[key] = value;
    this.persist()
  }

  persist() {
    localStorage.setItem('errbuddy.config', JSON.stringify(this._config))
  }

}
