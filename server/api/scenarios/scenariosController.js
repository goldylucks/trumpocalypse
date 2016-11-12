const Scenarios = require('./scenariosModel')
const Users = require('../users/usersModel')

module.exports = {
  get: get,
  getOne: getOne,
  post: post,
  voteUp: voteUp,
  voteDown: voteDown,
  put: put,
}

function get (req, res, next) {
  Scenarios.find({})
    .then(scenarios => res.json(scenarios))
    .catch(next)
}

function getOne (req, res, next) {
  const id = req.params.id
  Scenarios.findById(id)
    .then(scenario => res.json(scenario))
    .catch(next)
}

function post (req, res, next) {
  const newScenario = req.body
  newScenario.userId = req.user._id

  Scenarios.create(newScenario)
    .then(scenario => res.status(201).json(scenario))
    .catch(next)
}

function put (req, res, next) {
  Scenarios.update({ _id: req.params.id }, { $set: req.body })
    .then(dbRes => res.json(dbRes))
    .catch(next)
}

function voteUp (req, res, next) {
  const scenarioId = req.params.id
  const userId = req.user._id
  let scoreInc = 1
  return Users.findById(userId).then(user => {
    user = user.toObject()
    const prevVote = user.scenarioVotes[scenarioId]
    if (prevVote === 1) {
      throw Error('Already voted up this scenario!')
    }
    if (prevVote === -1) {
      scoreInc = 2
    }
    user.scenarioVotes[scenarioId] = 1
    return user.scenarioVotes
  }).then(userScenarioVotes => {
    return Promise.all([updateScenarioScore(scenarioId, scoreInc), updateUserVotes(userScenarioVotes, userId)])
  }).then(dbRes => res.json(scoreInc))
  .catch(next)
}

function voteDown (req, res, next) {
  const scenarioId = req.params.id
  const userId = req.user._id
  let scoreDec = 1
  return Users.findById(userId).then(user => {
    user = user.toObject()
    const prevVote = user.scenarioVotes[scenarioId]
    if (prevVote === -1) {
      throw Error('Already voted down this scenario!')
    }
    if (prevVote === 1) {
      scoreDec = 2
    }
    user.scenarioVotes[scenarioId] = -1
    return user.scenarioVotes
  }).then(userScenarioVotes => {
    return Promise.all([updateScenarioScore(scenarioId, -scoreDec), updateUserVotes(userScenarioVotes, userId)])
  }).then(dbRes => res.json(scoreDec))
  .catch(next)
}

function updateUserVotes (userScenarioVotes, userId) {
  return Users.findOneAndUpdate({ _id: userId }, { $set: { scenarioVotes: userScenarioVotes } })
}

function updateScenarioScore (id, scoreToInc) {
  return Scenarios.findOneAndUpdate({ _id: id }, { $inc: { score: scoreToInc } })
}
