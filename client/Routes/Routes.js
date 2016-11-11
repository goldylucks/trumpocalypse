import React, { Component } from 'react'

import { Router, Route, hashHistory, IndexRedirect } from 'react-router'

import AppContainer from '../Containers/App'
import ScenariosContainer from '../Containers/Scenarios'
import ScenarioContainer from '../Containers/Scenario'
import SubmitScenarioContainer from '../Containers/SubmitScenario'
import TrumpTheTrumpContainer from '../Containers/TrumpTheTrump'
import AuthContainer from '../Containers/Auth'

export default class Routes extends Component {

  render () {
    return (
      <Router history={ hashHistory }>
        <Route path={ '/' } component={ AppContainer }>
          <IndexRedirect to='scenarios' />
          <Route path={ 'scenarios' } component={ ScenariosContainer } />
          <Route path={ 'scenarios/:id' } component={ ScenarioContainer } />
          <Route path={ 'submit-scenario' } component={ SubmitScenarioContainer } />
          <Route path={ 'trump-the-trump' } component={ TrumpTheTrumpContainer } />
          <Route path={ 'auth' } component={ AuthContainer } />
        </Route>
      </Router>
    )
  }

}
