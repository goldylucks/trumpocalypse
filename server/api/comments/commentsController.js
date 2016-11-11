const Comments = require('./commentsModel')

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
  console.log('newComment', newComment)
  Comments.create(newComment)
    .then(text => res.status(201).json(text))
    .catch(next)
}

function voteUp (req, res, next) {
  Comments.findOneAndUpdate({ _id: req.params.id }, { $inc: { score: 1 } })
    .then(DBres => res.json(DBres))
    .catch(next)
}

function voteDown (req, res, next) {
  Comments.findOneAndUpdate({ _id: req.params.id }, { $inc: { score: -1 } })
    .then(DBres => res.json(DBres))
    .catch(next)
}
