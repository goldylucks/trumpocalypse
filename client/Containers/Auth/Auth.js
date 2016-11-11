import React, { Component, PropTypes } from 'react'
import styles from './Auth.css'

export default class AuthContainer extends Component {

  static propTypes = {
    onLogin: PropTypes.func,
    onSignup: PropTypes.func,
  }

  state = {
    name: '',
    email: '',
    password: '',
    rePassword: '',
  }

  render () {
    return (
      <div className={ styles.container }>
        <h1>Get on board, every vote counts!</h1>
        <form>
          <div className={ styles.formControl }>
            <label>Name <small>(public)</small></label>
            <input onChange={ this.onNameChange } value={ this.state.name } type='text' placeholder='put your user name here' />
          </div>
          <div className={ styles.formControl }>
            <label>Email</label>
            <input onChange={ this.onEmailChange } value={ this.state.email } type='email' placeholder='put your email here' />
          </div>
          <div className={ styles.formControl }>
            <label>Password</label>
            <input onChange={ this.onPasswordChange } value={ this.state.password } type='password' placeholder='put your password here' />
          </div>
          <div className={ styles.formControl }>
            <label>Repeat Password</label>
            <input onChange={ this.onRePasswordChange } value={ this.state.rePassword } type='password' placeholder='put your password again here' />
          </div>
          <div className={ styles.actions }>
            <button onClick={ this.signup } type='button'>Signup</button>
            <button onClick={ this.login } type='button'>Login</button>
          </div>
        </form>
      </div>
    )
  }

  login = () => {
    this.props.onLogin(this.state)
  }

  signup = () => {
    this.props.onSignup(this.state)
  }

  onNameChange = evt => {
    this.setState({ name: evt.target.value })
  }

  onEmailChange = evt => {
    this.setState({ email: evt.target.value })
  }

  onPasswordChange = evt => {
    this.setState({ password: evt.target.value })
  }

  onRePasswordChange = evt => {
    this.setState({ rePassword: evt.target.value })
  }

}
