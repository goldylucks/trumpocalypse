import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './Header.css'

export default class HeaderContainer extends Component {

  static propTypes = {
    userName: PropTypes.string,
    onLogout: PropTypes.func,
  }

  state = {
    isAuthModalOpen: false,
  }

  render () {
    return (
      <div className={ styles.container }>
        <div className={ styles.header }>
          <h1 className={ styles.headline }>TRUMPOCALYPSE</h1>
        </div>
        <nav className={ styles.nav }>
          <Link to='scenarios' activeClassName={ styles.active } className={ styles.navItem }>Scenarios</Link>
          <Link to='trump-the-trump' activeClassName={ styles.active } className={ styles.navItem }>Trump the Trump</Link>
          {/* <Link to='images' activeClassName={ styles.active } className={ styles.navItem }>Images</Link>
          <Link to='gifs' activeClassName={ styles.active } className={ styles.navItem }>Gifs</Link>*/}
          { this.renderAuthNavItem() }
        </nav>
      </div>
    )
  }

  renderAuthNavItem () {
    if (this.props.userName) {
      return (
        <span className={ styles.navItem } style={ { cursor: 'text' } }>
          { this.props.userName }
          <a onClick={ this.onLogout }> <small>Logout :(</small></a>
        </span>
      )
    }
    return (
      <Link to='auth' className={ styles.navItem }>Login / Register</Link>
    )
  }

  onLogout = () => {
    this.props.onLogout()
  }

}
