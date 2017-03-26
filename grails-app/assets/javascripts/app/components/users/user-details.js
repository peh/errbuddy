var cx = require('classnames');
var swal = require('sweetalert');

import BaseComponent from "../tools/base-component";
import ValidateableInput from "../tools/validateable-input";
import React from "react";
import * as  _ from "lodash";

const POSSIBLE_ROLES = {
  ROLE_ROOT: 'ROOT',
  ROLE_ADMIN: 'ADMIN',
  ROLE_USER: 'USER'
};

export default class UserDetails extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      user: {
        errors: [],
      },
      dirty: false,
      saved: false,
      loading: true
    };

    this._bindThis('onValueChange', 'reset', 'onFormSubmit', '_showError', '_onDeleteButtonClicked', 'userSaveErrorCallback', 'loadUser')

    if (props.userId) {
      this.loadUser(props.userId)
    } else {
      setTimeout(()=> {
        this.setState(_.assign(this.state, {loading: false}))
      }, 500)
    }
  }

  loadUser(userId) {
    this.getUserService().getUser(userId)
      .then((user)=> {
        this.reset(user.user)
      });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.userId && parseInt(newProps.userId) !== this.state.user.id) {
      this.setState(_.assign(this.state, {loading: true}));
      this.loadUser(newProps.userId)
    }
  }

  reset(user) {
    this.setState(_.assign(this.state, {user: user, dirty: false, loading: false, saved: false, errors: []}))
  }

  _onDeleteButtonClicked() {
    if(this.state.user.id === this.getMe().id){
      swal({
        title: 'Error!',
        text: 'You cannot delete yourself!',
        type: 'error',
        confirmButtonText: 'Okay',
      });
      return
    }
    swal({
      title: 'Are you sure you want to delete this user?',
      text: 'This action cannot be undone',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No!',
    }, ()=> {
      this.getUserService().del(this.state.user).then(()=> {
        this.navigate('/users');
      }).catch(this.userSaveErrorCallback)
    })
  }

  onFormSubmit(e) {
    this.hideError()
    e.preventDefault();
    if (this.state.dirty) {
      this.getUserService().save(this.state.user)
        .then((user)=> {
          swal({
            title: 'User saved!',
            type: 'success',
            timer: 1000
          })
          if (!this.state.user.id) {
            this.navigate(`/users/${user.user.id}`, false)
          } else {
            this.reset(user.user)
          }
        })
        .catch(this.userSaveErrorCallback);
    }
  }

  userSaveErrorCallback(response) {
    if (response.status === 400) {
      response.json().then((resp)=> {
        this.setState(_.assign(this.state, {errors: resp.errors}))
      })
      throw response
    } else {
      this.showError(`Something went wrong: ${response.statusText}`);
      throw response
    }
  }

  onValueChange(e) {
    let prop = e.target.getAttribute('name');
    let value = null;
    let user = _.assign(this.state.user);
    switch (e.target.type) {
      case 'checkbox':
        value = e.target.checked;
        break;
      case 'select-multiple':
        value = _.map(e.target.selectedOptions, (option)=> {
          return option.value
        });
        break;
      default:
        value = e.target.value;
        break;
    }

    user[prop] = value;
    this.setState({
      user: user,
      dirty: true,
      saved: false
    });
  }

  render() {
    var roles = _.map(POSSIBLE_ROLES, (name, value)=> {
      return (<option value={value} key={value}>{name}</option>)
    });
    const {user, saved, dirty, errors} = this.state;
    var hasErorrs = errors && errors.length > 0;
    var classes = cx({
      'btn': true,
      'btn-default': true,
      'disabled': !dirty,
      'btn-success': saved && !hasErorrs,
      'btn-danger': !saved && hasErorrs,
      'shake': saved || hasErorrs,
      'freez': saved || hasErorrs,
      'shake-rotate': saved || hasErorrs
    });
    return (
      <section>
            <form onSubmit={this.onFormSubmit} className="form-horizontal" autoComplete="new-password">
              <ValidateableInput errors={errors} bean={user} property="username" label="Username" placeholder=""
                                 required={true} onValueChange={this.onValueChange}/>
              <ValidateableInput errors={errors} type="email" bean={user} property="email" label="Email" placeholder=""
                                 required={true} onValueChange={this.onValueChange}/>
              <ValidateableInput errors={errors} bean={user} property="name" label="Name" placeholder=""
                                 required={true} onValueChange={this.onValueChange}/>
              <ValidateableInput errors={errors} type="password" bean={user} property="password" label="Password"
                                 placeholder={!user.id ? '' : "leave blank if you don't want to change"}
                                 required={!user.id} onValueChange={this.onValueChange}/>

              <div className="form-group">
                <label htmlFor="enabled" className="col-sm-2 control-label">Enabled</label>

                <div className="col-sm-10">
                  <div className="checkbox">
                    <input type="checkbox" id="enabled" name="enabled" checked={user.enabled || false}
                           onChange={this.onValueChange}/>
                  </div>
                </div>
              </div>
              <div className={cx('form-group', {'has-error': user.roles && user.roles.length < 1})}>
                <label htmlFor="roles" className="col-sm-2 control-label">
                  Roles
                </label>

                <div className="col-sm-10">
                  <select name="roles" value={user.roles || []} multiple={true} onChange={this.onValueChange}
                          className="form-control" required="required">
                    {roles}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <button type="submit" className={classes}>
                    <i className="fa fa-floppy-o"></i>
                    &nbsp;Save
                  </button>
                  &nbsp;
                  <button type="button" className={cx('btn', 'btn-danger ', 'btn-sm', {disabled: user.id === this.getMe().id})} onClick={this._onDeleteButtonClicked}>
                    <i className="fa fa-trash"></i>
                    &nbsp;Delete
                  </button>
                </div>
              </div>
            </form>
      </section>
    );
  }

}
