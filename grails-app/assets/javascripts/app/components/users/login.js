import React from "react";
import BaseComponent from "../tools/base-component";
import * as  _ from "lodash";

export default class LoginView extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: false
    };

    this._bindThis('onSubmit', 'onInputChange')
  }

  componentDidMount() {
    if (this.getMe()) {
      setTimeout(() => {
        this.navigate("/")
      }, 200)
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const {username, password} = this.state;
    this.getUserService().login(username, password)
      .then((user) => {
        this.props.onUserLoggedIn(user);
      })
      .catch((err) => {
        this.updateState({error: true})
      });
  }

  onInputChange(e) {
    let obj = e.target;
    this.setState(_.assign(this.state, {[obj.name]: obj.value}))
  }

  render() {
    let alert = ""
    if (this.state.error) {
      alert = (<div className="alert alert-danger">Login Failed!</div>)
    }
    return (
      <section>
        {alert}
          <form method="POST" role="form" autoComplete={false} onSubmit={this.onSubmit}>
            <div className="group">
              <label htmlFor="username" className="col-sm-2 control-label">
                Username
              </label>

              <div className="inputs">
                <input type="text" value={this.state.username} name="username"
                       onChange={this.onInputChange} autoComplete={false}/>
              </div>
            </div>
            <div className="group">
              <label htmlFor="password" className="col-sm-2 control-label">
                Password
              </label>

              <div className="inputs">
                <input type="password" className="form-control" value={this.state.password} name="password"
                       onChange={this.onInputChange} autoComplete={false}/>
              </div>
            </div>
            <div className="group">
              <div className="inputs">
                <button type="submit" className="btn btn-default">
                  Login
                </button>
              </div>
            </div>
          </form>
      </section>

    );
  }

}
