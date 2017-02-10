import React from "react";
import BaseComponent from "../tools/base-component";
import * as  _ from 'lodash';

export default class LoginView extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };

    this._bindThis('onSubmit', 'onInputChange')
  }

  onSubmit(e) {
    e.preventDefault();
    const {username, password} = this.state;
    this.props.onSubmit(username, password);
  }

  onInputChange(e) {
    let obj = e.target;
    this.setState(_.assign(this.state, {[obj.name]: obj.value}))
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <form method="POST" className="form" role="form" autoComplete={false} onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="col-sm-2 control-label">
                Username
              </label>

              <div className="col-sm-10">
                <input type="text" className="form-control" value={this.state.username} name="username"
                       onChange={this.onInputChange} autoComplete={false}/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password" className="col-sm-2 control-label">
                Password
              </label>

              <div className="col-sm-10">
                <input type="password" className="form-control" value={this.state.password} name="password"
                       onChange={this.onInputChange} autoComplete={false}/>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <button type="submit" className="btn btn-default">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    );
  }

}
