/* globals localStorage */
const BASE_KEY = 'errbuddy:config:'

export default class ConfigurationService {

  static get(key) {
    return JSON.parse(localStorage.getItem(this._buildKey(key)))
  }

  static set(key, value) {
    localStorage.setItem(this._buildKey(key), JSON.stringify(value));
  }

  static _buildKey(key) {
    return `${BASE_KEY}${key}`
  }

}
