
import React, { Component, PropTypes } from 'react'
import styles from './TrumpTheTrump.css'

export default class TrumpTheTrumpContainer extends Component {

  render () {
    return (
      <div className={ styles.container }>
        <iframe src='http://trumpdonald.org' className={ styles.iframe } />
      </div>
    )
  }

}
