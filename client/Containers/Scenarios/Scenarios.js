import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import TimeAgo from 'react-timeago'

import { API_URL } from '../../constants'
import Vote from '../../Components/Vote'
import styles from './Scenarios.css'

export default class ScenariosContainer extends Component {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    user: PropTypes.object,
    onUpdateUser: PropTypes.func,
  }

  state = {
    scenarios: [],
  }

  componentWillMount () {
    this.fetchScenarios()
  }

  render () {
    return (
      <div className={ styles.container }>
        <img src={ 'https://media.tenor.co/images/cffcc50688433f8061982313b0fdc5ab/tenor.gif' } className={ styles.backgroundGif } />
        <h1 className={ styles.title }>What is YOUR favorite Trumpocalypse scenario?</h1>
        <p>{ this.renderSubmitLink() }, rate and comment on others!</p>
        { this.renderScenarios() }
      </div>
    )
  }

  renderScenarios () {
    return this.state.scenarios.map(s => (
      <div className={ styles.scenario } key={ s._id }>
        <Vote
          userVoteValue={ this.props.user.scenarioVotes && this.props.user.scenarioVotes[s._id] }
          score={ s.score }
          onVoteDown={ this.onVoteDown.bind(this, s._id) }
          onVoteUp={ this.onVoteUp.bind(this, s._id) }
        />
        <Link to={ `scenarios/${s._id}` } className={ styles.comments }>
          { s.commentCount } <br />
          Comments
        </Link>
        <Link to={ `scenarios/${s._id}` } className={ styles.scenarioTitle }>{ s.title }</Link>
        <div className={ styles.scenariosStats }>
          <TimeAgo date={ s.createdAt } /> <br />by { s.userName }
        </div>
      </div>
    ))
  }

  renderSubmitLink () {
    if (!this.props.user.token) {
      return <Link to={ 'auth' } onClick={ () => global.alert('Please login to vote! every vote counts!') }>Submit your own</Link>
    }

    return <Link to={ 'submit-scenario' }>Submit your own</Link>
  }

  async fetchScenarios () {
    try {
      const { data: scenarios } = await axios.get(`${API_URL}/scenarios`)
      console.log('fetching scenarios success!', scenarios)
      this.setState({ scenarios })
    } catch (err) {
      console.log('fetching scenarios err :(', err)
    }
  }

  async onVoteUp (id) {
    const { user } = this.props
    if (!user.token) {
      global.alert('Login and vote! Remember, every vote counts!')
      this.context.router.push({ pathname: '/auth' })
      return
    }
    this.onVoteUpOptimisticUpdate(id)
    try {
      axios.put(`${API_URL}/scenarios/${id}/voteUp`)
      console.log(`voting up scenario success! ${id}`)
      user.scenarioVotes[id] = 1
      this.props.onUpdateUser(user)
    } catch (err) {
      console.warn(`voting up scenario err :( ${id} ...`, err)
      this.onVoteUpOptimisticUpdate(id, { reverse: true })
    }
  }

  async onVoteDown (id) {
    const { user } = this.props
    if (!user.token) {
      global.alert('Login and vote! Remember, every vote counts!')
      this.context.router.push({ pathname: '/auth' })
      return
    }
    this.onVoteDownOptimisticUpdate(id)
    try {
      await axios.put(`${API_URL}/scenarios/${id}/voteDown`)
      console.log(`voting down scenario success! ${id} ...`)
      user.scenarioVotes[id] = -1
      this.props.onUpdateUser(user)
    } catch (err) {
      console.warn(`voting down scenario err :( ${id} ...`, err)
      this.onVoteDownOptimisticUpdate(id, { reverse: true })
    }
  }

  onVoteUpOptimisticUpdate (id, { reverse } = {}) {
    let scoreInc = 1
    if (this.getUserVote(id) === -1) {
      scoreInc = 2
    }
    if (reverse) {
      scoreInc = -scoreInc
    }
    this.setState({
      scenarios: this.state.scenarios.map(s => {
        if (s._id === id) {
          s.score += scoreInc
        }
        return s
      }),
    })
  }

  onVoteDownOptimisticUpdate (id, { reverse } = {}) {
    let scoreDec = 1
    if (this.getUserVote(id) === 1) {
      scoreDec = 2
    }
    if (reverse) {
      scoreDec = -scoreDec
    }
    this.setState({
      scenarios: this.state.scenarios.map(s => {
        if (s._id === id) {
          s.score -= scoreDec
        }
        return s
      }),
    })
  }

  getUserVote (id) {
    return this.props.user.scenarioVotes[id]
  }

}
