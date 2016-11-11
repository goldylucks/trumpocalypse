const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TextsSchema = getSchema()

module.exports = mongoose.model('texts', TextsSchema)

function getSchema () {
  return new Schema({

    title: {
      type: String,
      required: true,
    },

    description: String,

    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      default: 0,
    },

    commentCount: {
      type: Number,
      required: true,
      default: 0,
    },

  })
}
