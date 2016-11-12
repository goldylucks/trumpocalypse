import React, { Component, PropTypes } from 'react'
import TimeAgo from 'react-timeago'

import Vote from '../Vote'
import styles from './Comment.css'

export default class Comment extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    userVoteValue: PropTypes.number,
    onVoteUp: PropTypes.func.isRequired,
    onVoteDown: PropTypes.func.isRequired,
  }

  render () {
    const { score, text, userName, createdAt, userVoteValue, onVoteUp, onVoteDown } = this.props
    return (
      <div className={ styles.container }>
        <div style={ { float: 'left' } }>
          <Vote
            userVoteValue={ userVoteValue }
            score={ score }
            size='small'
            onVoteUp={ onVoteUp }
            onVoteDown={ onVoteDown }
          />
        </div>
        <span className={ styles.text }>{ text }</span>
        <span className={ styles.userName }>{ userName }</span>
        <span className={ styles.timeAgo }><TimeAgo date={ createdAt } /></span>
      </div>
    )
  }

}
