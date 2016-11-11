import React, { Component, PropTypes } from 'react'
import axios from 'axios'

import { API_URL } from '../../constants'
import styles from './SubmitScenario.css'

export default class SubmitScenario extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }

  state = {
    title: '',
    description: '',
  }

  render () {
    return (
      <div className={ styles.container }>
        <h1>Which Trumpocalypse do YOU see happening?</h1>
        <form>
          <div className={ styles.formControl }>
            <label>Title</label>
            <input value={ this.state.title } onChange={ this.onTitleChange } type='text' placeholder='write your exciting title here!' />
          </div>
          <div className={ styles.formControl }>
            <label>Description (optional)</label>
            <textarea value={ this.state.description } onChange={ this.onDescriptionChange } placeholder='If you wish, provide additional details about your Trumpocalypse' />
          </div>
          <div className={ styles.actions }>
            <button onClick={ this.submit } type='button'>Submit</button>
          </div>
        </form>
      </div>
    )
  }

  onTitleChange = evt => {
    this.setState({ title: evt.target.value })
  }

  onDescriptionChange = evt => {
    this.setState({ description: evt.target.value })
  }

  submit = () => {
    const { name: userName } = this.props.user
    const { title, description } = this.state
    console.log('submitting scenario:', title, description)
    axios.post(`${API_URL}/scenarios`, { title, description, userName })
      .then(res => {
        console.log('submitting scenario: success!', res.data)
        this.context.router.push({ pathname: `scenarios/${res.data._id}` })
      })
      .catch(err => {
        console.log('submitting scenario: err :(', err)
      })
  }
}
