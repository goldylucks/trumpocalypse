const Comments = require('./commentsModel')
const Users = require('../users/usersModel')
const Scenarios = require('../scenarios/scenariosModel')

module.exports = {
  getByScenario: getByScenario,
  post: post,
  voteUp: voteUp,
  voteDown: voteDown,
}

function getByScenario (req, res, next) {
  const scenarioId = req.params.id
  Comments.find({ scenarioId: scenarioId })
    .then(comments => res.json(comments))
    .catch(next)
}

function post (req, res, next) {
  const newComment = req.body
  newComment.userId = req.user._id
  Promise.all([Comments.create(newComment), Scenarios.findOneAndUpdate({ _id: newComment.scenarioId }, { $inc: { commentCount: 1 } })])
    .then(dbRes => dbRes[0])
    .then(text => res.status(201).json(text))
    .catch(next)
}

function voteUp (req, res, next) {
  const commentId = req.params.id
  const userId = req.user._id
  let scoreInc = 1
  return Users.findById(userId).then(user => {
    user = user.toObject()
    const prevVote = user.commentVotes[commentId]
    if (prevVote === 1) {
      throw Error('Already voted up this comment!')
    }
    if (prevVote === -1) {
      scoreInc = 2
    }
    user.commentVotes[commentId] = 1
    return user.commentVotes
  }).then(userCommentVotes => {
    return Promise.all([updateCommentScore(commentId, scoreInc), updateUserVotes(userCommentVotes, userId)])
  }).then(dbRes => res.json(scoreInc))
  .catch(next)
}

function voteDown (req, res, next) {
  const commentId = req.params.id
  const userId = req.user._id
  let scoreDec = 1
  return Users.findById(userId).then(user => {
    user = user.toObject()
    const prevVote = user.commentVotes[commentId]
    if (prevVote === -1) {
      throw Error('Already voted down this comment!')
    }
    if (prevVote === 1) {
      scoreDec = 2
    }
    user.commentVotes[commentId] = -1
    return user.commentVotes
  }).then(userCommentVotes => {
    return Promise.all([updateCommentScore(commentId, -scoreDec), updateUserVotes(userCommentVotes, userId)])
  }).then(dbRes => res.json(scoreDec))
  .catch(next)
}

function updateUserVotes (userCommentVotes, userId) {
  return Users.findOneAndUpdate({ _id: userId }, { $set: { commentVotes: userCommentVotes } })
}

function updateCommentScore (id, scoreToInc) {
  return Comments.findOneAndUpdate({ _id: id }, { $inc: { score: scoreToInc } })
}
