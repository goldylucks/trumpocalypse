const router = require('express').Router()
const controller = require('./commentsController')
const usersService = require('../users/usersService')

router.route('/')
  .post(usersService.decodeToken, controller.post)

router.route('/getByScenario/:id')
  .get(controller.getByScenario)

router.route('/:id/voteUp')
  .put(usersService.decodeToken, controller.voteUp)

router.route('/:id/voteDown')
  .put(usersService.decodeToken, controller.voteDown)

module.exports = router
