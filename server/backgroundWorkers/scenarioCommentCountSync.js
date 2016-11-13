const Comments = require('../api/comments/commentsModel')
const Scenarios = require('../api/scenarios/scenariosModel')
const each = require('async/each')

sync()

function sync () {
  Comments.find({})
  .then(comments => {
    return comments.reduce((memo, c) => {
      if (!memo[c.scenarioId]) {
        memo[c.scenarioId] = 0
      }
      memo[c.scenarioId] += 1
      return memo
    }, {})
  })
  .then(res => {
    each(Object.keys(res), (scenarioId, cb) => {
      const commentCount = res[scenarioId]
      Scenarios.findOneAndUpdate({ _id: scenarioId }, { $set: { commentCount: commentCount } }, cb)
    }, err => {
      if (err) {
        console.log('error syncing comment count :(', err)
      } else {
        console.log('success syncing comment count!')
      }
      global.scenarioCommentSyncTimeout = setTimeout(sync, 1000 * 60 * 60)
    })
  })
  .catch(err => console.warn('error: scenarioCommentCountSync', err))
}
