const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = getSchema()

module.exports = mongoose.model('comment', CommentSchema)

function getSchema () {
  return new Schema({

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },

    scenarioId: {
      type: Schema.Types.ObjectId,
      ref: 'scenarios',
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
      min: 2,
    },

    score: {
      type: Number,
      required: true,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

  })
}
