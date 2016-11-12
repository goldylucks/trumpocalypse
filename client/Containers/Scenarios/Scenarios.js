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
    console.log('fetching scenarios ...')
    const { data: scenarios } = await axios.get(`${API_URL}/scenarios`)
    this.setState({ scenarios })
  }

  async onVoteUp (id) {
    const { user } = this.props
    if (!user.token) {
      global.alert('Login and vote! Remember, every vote counts!')
      this.context.router.push({ pathname: '/auth' })
      return
    }
    try {
      const { data: scoreInc } = await axios.put(`${API_URL}/scenarios/${id}/voteUp`)
      console.log(`voting up scenario success! ${id}`)
      this.setState({
        scenarios: this.state.scenarios.map(s => {
          if (s._id === id) { s.score += scoreInc }
          return s
        }),
      })
      user.scenarioVotes[id] = 1
      this.props.onUpdateUser(user)
    } catch (err) {
      console.warn(`voting up scenario err :( ${id} ...`, err)
    }
  }

  async onVoteDown (id) {
    const { user } = this.props
    if (!user.token) {
      global.alert('Login and vote! Remember, every vote counts!')
      this.context.router.push({ pathname: '/auth' })
      return
    }
    try {
      const { data: scoreDec } = await axios.put(`${API_URL}/scenarios/${id}/voteDown`)
      console.log(`voting down scenario success! ${id} ...`)
      this.setState({
        scenarios: this.state.scenarios.map(s => {
          if (s._id === id) { s.score -= scoreDec }
          return s
        }),
      })
      user.scenarioVotes[id] = -1
      this.props.onUpdateUser(user)
    } catch (err) {
      console.warn(`voting down scenario err :( ${id} ...`, err)
    }
  }
}
