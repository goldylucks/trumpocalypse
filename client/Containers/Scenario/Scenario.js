import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import TimeAgo from 'react-timeago'

import { API_URL } from '../../constants'
import Vote from '../../Components/Vote'
import Comment from '../../Components/Comment'
import styles from './Scenario.css'

export default class ScenarioContainer extends Component {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
      token: PropTypes.string,
      scenarioVotes: PropTypes.object,
      commentVotes: PropTypes.object,
    }),
    onUpdateUser: PropTypes.func,
  }

  state = {
    scenario: {},
    comments: [],
    newCommentText: '',
  }

  componentWillMount () {
    this.fetchScenario()
    this.fetchComments()
  }

  componentDidMount () {
    document.addEventListener('keypress', this.listenToEnterNewComment)
  }

  componentWillUnMount () {
    document.addEventListener('keypress', this.listenToEnterNewComment)
  }

  render () {
    if (!this.state.ready) {
      return (
        <div className={ styles.container }>Loading ...</div>
      )
    }
    const { title, createdAt, score, userName } = this.state.scenario
    return (
      <div className={ styles.container }>
        <div className={ styles.top }>
          <div style={ { float: 'left' } }>
            <Vote
              score={ score }
              onVoteUp={ this.onVoteUp.bind(this) }
              onVoteDown={ this.onVoteDown.bind(this) }
              userVoteValue={ this.props.user.scenarioVotes && this.props.user.scenarioVotes[this.props.params.id] }
            />
          </div>
          <h1 className={ styles.title }>{ title }</h1>
          { this.renderDescription() }
          <span className={ styles.stats }>
            Submitted <TimeAgo minPeriod={ 10 } date={ createdAt } /> by { userName }
          </span>
        </div>
        <hr />
        <h4>Comments</h4>
        <div className={ styles.newComment }>
          <input ref={ el => this._commentInput = el } value={ this.state.newCommentText } onChange={ this.onNewCommentTextChange } placeholder='Write your comment here!' />
          <button onClick={ this.submitComment.bind(this) }>Submit</button>
        </div>
        { this.renderComments() }
      </div>
    )
  }

  renderDescription () {
    const { description } = this.state.scenario
    if (description) {
      return (
        <p className={ styles.description }>{ description }</p>
      )
    }
  }

  renderComments () {
    if (!this.state.comments.length) {
      return (
        <p>No comments for this scenario, be the first one to
          <a className={ styles.sparkConversationLink } onClick={ () => this._commentInput.focus() }> spark up the conversation</a>!
        </p>
      )
    }
    return this.state.comments.map(c => (
      <Comment
        key={ c._id }
        userVoteValue={ this.props.user.commentVotes && this.props.user.commentVotes[c._id] }
        { ...c }
        onVoteUp={ this.onCommentVoteUp.bind(this, c._id) }
        onVoteDown={ this.onCommentVoteDown.bind(this, c._id) }
      />
    ))
  }

  onNewCommentTextChange = evt => {
    this.setState({ newCommentText: evt.target.value })
  }

  async submitComment () {
    const { newCommentText: text } = this.state
    const newComment = { text, userName: this.props.user.name, scenarioId: this.props.params.id, createdAt: String(new Date()), score: 0, key: 5 }
    this.setState({ comments: this.state.comments.concat(newComment), newCommentText: '' })
    try {
      const newCommentFromServer = await axios.post(`${API_URL}/comments`, newComment)
      console.log('submitting comment success!', newCommentFromServer)
      this.setState({ newCommentText: '' })
    } catch (err) {
      console.warn('submitting comment err :(', err)
    } finally {
      this.fetchComments()
    }
  }

  async fetchScenario () {
    try {
      const { data: scenario } = await axios.get(`${API_URL}/scenarios/${this.props.params.id}`)
      console.log('fetching scenario success!', scenario)
      this.setState({ scenario, ready: true })
    } catch (err) {
      console.log(`fetching scenario err :( ${this.props.params.id}`)
    }
  }

  async fetchComments () {
    try {
      const { data: comments } = await axios.get(`${API_URL}/comments/getByScenario/${this.props.params.id}`)
      console.log('fetching comments success!', comments)
      this.setState({ comments })
    } catch (err) {
      console.log('fetching comments err :(', err)
    }
  }

  async onVoteUp () {
    const { user, params } = this.props
    if (!user.token) {
      global.alert('Login and vote! Remember, every vote counts!')
      this.context.router.push({ pathname: '/auth' })
      return
    }
    this.onVoteUpOptimisticUpdate()
    try {
      await axios.put(`${API_URL}/scenarios/${params.id}/voteUp`)
      console.log(`voting up scenario success! ${params.id} ...`)
      user.scenarioVotes[params.id] = 1
      this.props.onUpdateUser(user)
    } catch (err) {
      console.warn(`voting up scenario err:( ${this.props.params.id} ...`, err)
      this.onVoteUpOptimisticUpdate({ reverse: true })
    }
  }

  async onVoteDown () {
    const { user, params } = this.props
    if (!user.token) {
      global.alert('Login and vote! Remember, every vote counts!')
      this.context.router.push({ pathname: '/auth' })
      return
    }
    this.onVoteDownOptimisticUpdate()
    try {
      await axios.put(`${API_URL}/scenarios/${params.id}/voteDown`)
      console.log(`voting down scenario success! ${params.id} ...`)
      user.scenarioVotes[params.id] = -1
      this.props.onUpdateUser(user)
    } catch (err) {
      this.onVoteDownOptimisticUpdate({ reverse: true })
      console.warn(`voting down scenario er :( ${params.id} ...`, err)
    }
  }

  async onCommentVoteUp (id) {
    const { user } = this.props
    if (!user.token) {
      global.alert('Login and vote! Remember, every vote counts!')
      this.context.router.push({ pathname: '/auth' })
      return
    }
    this.onCommentVoteUpOptimisticUpdate(id)
    try {
      await axios.put(`${API_URL}/comments/${id}/voteUp`)
      console.log(`voting up comment success! ${id} ...`)
      user.commentVotes[id] = 1
      this.props.onUpdateUser(user)
    } catch (err) {
      console.warn(`voting up comment err :( ${id} ...`, err)
      this.onCommentVoteUpOptimisticUpdate(id, { reverse: true })
    }
  }

  async onCommentVoteDown (id) {
    const { user } = this.props
    if (!user.token) {
      global.alert('Login and vote! Remember, every vote counts!')
      this.context.router.push({ pathname: '/auth' })
      return
    }
    this.onCommentVoteDownOptimisticUpdate(id)
    try {
      axios.put(`${API_URL}/comments/${id}/voteDown`)
      console.log(`voting down comment success! ${id} ...`)
      user.commentVotes[id] = -1
      this.props.onUpdateUser(user)
    } catch (err) {
      console.warn(`voting down comment err :( ${id} ...`, err)
      this.onCommentVoteDownOptimisticUpdate(id, { reverse: true })
    }
  }

  onVoteUpOptimisticUpdate ({ reverse } = {}) {
    const { scenario } = this.state
    let scoreInc = 1
    if (this.getUserScenarioVote() === -1) {
      scoreInc = 2
    }
    if (reverse) {
      scoreInc = -scoreInc
    }
    scenario.score += scoreInc
    this.setState({ scenario })
  }

  onVoteDownOptimisticUpdate ({ reverse } = {}) {
    const { scenario } = this.state
    let scoreDec = 1
    if (this.getUserScenarioVote() === 1) {
      scoreDec = 2
    }
    if (reverse) {
      scoreDec = -scoreDec
    }
    scenario.score -= scoreDec
    this.setState({ scenario })
  }

  getUserScenarioVote () {
    return this.props.user.scenarioVotes[this.props.params.id]
  }

  onCommentVoteUpOptimisticUpdate (id, { reverse } = {}) {
    let scoreInc = 1
    if (this.getUserCommentVote(id) === -1) {
      scoreInc = 2
    }
    if (reverse) {
      scoreInc = -scoreInc
    }
    this.setState({
      comments: this.state.comments.map(c => {
        if (c._id === id) {
          c.score += scoreInc
        }
        return c
      }),
    })
  }

  onCommentVoteDownOptimisticUpdate (id, { reverse } = {}) {
    let scoreDec = 1
    if (this.getUserCommentVote(id) === 1) {
      scoreDec = 2
    }
    if (reverse) {
      scoreDec = -scoreDec
    }
    this.setState({
      comments: this.state.comments.map(c => {
        if (c._id === id) {
          c.score -= scoreDec
        }
        return c
      }),
    })
  }

  getUserCommentVote (id) {
    return this.props.user.commentVotes[id]
  }

  listenToEnterNewComment = evt => {
    if (evt.keyCode !== 13 || document.activeElement !== ReactDOM.findDOMNode(this._commentInput)) {
      return
    }
    this.submitComment()
  }

}
