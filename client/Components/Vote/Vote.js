import React, { Component, PropTypes } from 'react'

import styles from './Vote.css'

export default class Vote extends Component {

  static propTypes = {
    score: PropTypes.number.isRequired,
    onVoteUp: PropTypes.func.isRequired,
    onVoteDown: PropTypes.func.isRequired,
    userVoteValue: PropTypes.number,
    scoreStyle: PropTypes.object,
    size: PropTypes.string,
  }

  render () {
    const { score, size, scoreStyle } = this.props
    return (
      <div className={ [styles.container, styles[size], this.userVoteClass()].join(' ') }>
        <a className={ [styles.voteUp, styles[size]].join(' ') } onClick={ this.onVoteUp }></a>
        <span style={ scoreStyle } className={ [styles.score, styles[size]].join(' ') }>{ score }</span>
        <a className={ [styles.voteDown, styles[size]].join(' ') } onClick={ this.onVoteDown }></a>
      </div>
    )
  }

  onVoteUp = () => {
    if (this.props.userVoteValue === 1) {
      return
    }
    this.props.onVoteUp()
  }

  onVoteDown = () => {
    if (this.props.userVoteValue === -1) {
      return
    }
    this.props.onVoteDown()
  }

  userVoteClass () {
    const { userVoteValue } = this.props
    if (userVoteValue === 1) {
      return styles.votedUp
    } else if (userVoteValue === -1) {
      return styles.votedDown
    }
  }

}
