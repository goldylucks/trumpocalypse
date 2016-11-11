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
  console.log('getting scenario with id', id)
  Scenarios.findById(id)
    .then(scenario => res.json(scenario))
    .catch(next)
}

function post (req, res, next) {
  const newScenario = req.body
  console.log('post scenario', req.body)
  newScenario.userId = req.user._id

  Scenarios.create(newScenario)
    .then(scenario => res.status(201).json(scenario))
    .catch(next)
}

function put (req, res, next) {
  Scenarios.update({ _id: req.params.id }, { $set: req.body })
    .then(DBres => res.json(DBres))
    .catch(next)
}

function voteUp (req, res, next) {
  const scenarioId = req.params.id
  const userId = req.user._id
  Promise.all([updateScenario(scenarioId, 1), updateUserVotes(scenarioId, userId, 1)])
    .then(DBres => res.json(DBres))
    .catch(next)
}

function voteDown (req, res, next) {
  const scenarioId = req.params.id
  const userId = req.user._id
  Promise.all([updateScenario(scenarioId, -1), updateUserVotes(scenarioId, userId, -1)])
    .then(DBres => res.json(DBres))
    .catch(next)
}

function updateUserVotes (scenarioId, userId, vote) {
  return Users.findById(userId).then(user => {
    console.log('user', user)
    user = user.toObject()
    user.scenarioVotes[scenarioId] = vote
    return user.scenarioVotes
  }).then(userScenarioVotes => {
    return Users.findOneAndUpdate({ _id: userId }, { $set: { scenarioVotes: userScenarioVotes } })
  })
}

function updateScenario (id, vote) {
  return Scenarios.findOneAndUpdate({ _id: id }, { $inc: { score: vote } })
}
