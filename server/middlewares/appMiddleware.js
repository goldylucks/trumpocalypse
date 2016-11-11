const config = require('../config/config')
const bodyParser = require('body-parser')
const override = require('method-override')
const cors = require('cors')
module.exports = function (app) {
  if (config.logging) {
    app.use(require('morgan')('dev'))
  }
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(override())
}
