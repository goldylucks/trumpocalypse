import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import { API_URL } from '../../constants'

import Header from '../../Components/Header'

import styles from './App.css'

export default class AppContainer extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    children: PropTypes.object.isRequired,
  }

  state = {
    user: {},
  }

  componentDidMount () {
    this.fetchUser()
  }

  render () {
    const childrenWithProps = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        onLogin: this.onLogin,
        onSignup: this.onSignup,
        onLogout: this.onLogout,
        onUpdateUser: this.onUpdateUser,
        user: this.state.user,
      })
    })
    return (
      <div className={ styles.container }>
        <Header userName={ this.state.user.name } onLogout={ this.onLogout } />
        { childrenWithProps }
      </div>
    )
  }

  fetchUser () {
    let user = localStorage.getItem('user')
    if (!user) {
      console.log('Guest detected')
      return
    }
    try {
      console.log('user detected:', user)
      user = JSON.parse(user)
      this.setState({ user })
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    } catch (err) {
      console.warn('error parsing user from LS', err)
    }
  }

  onSignup = user => {
    console.log('signup start: user with params', user)
    axios.post(`${API_URL}/users/`, user)
    .then(({ data: user }) => {
      console.log('signup success:', user)
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
      this.setState({ user })
      localStorage.setItem('user', JSON.stringify(user))
      this.context.router.push({ pathname: 'scenarios' })
    })
    .catch(err => {
      console.log('signup error:', err)
    })
  }

  onLogin = user => {
    console.log('login start: user with params', user)
    axios.post(`${API_URL}/users/login`, user)
    .then(({ data: user }) => {
      console.log('login success:', user)
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
      this.setState({ user })
      localStorage.setItem('user', JSON.stringify(user))
      this.context.router.push({ pathname: 'scenarios' })
    })
    .catch(err => {
      console.log('login error:', err)
    })
  }

  onLogout = () => {
    const userIsAsshole = global.confirm('logout? really? dont u care about the world around u?? Jeez ... click cancel to stick around, for a dose of good karma ;)')
    if (!userIsAsshole) {
      global.alert('YEAH! YOU ROCK! lets make america great again!')
      return
    }
    localStorage.removeItem('user')
    this.setState({ user: {} })
    this.context.router.push({ pathname: 'scenarios' })
  }

  onUpdateUser = user => {
    debugger
    this.setState({ user })
    localStorage.setItem('user', JSON.stringify(user))
  }

}
