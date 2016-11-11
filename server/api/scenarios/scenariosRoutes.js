const router = require('express').Router()
const controller = require('./scenariosController')
const usersService = require('../users/usersService')

router.route('/')
  .get(usersService.decodeToken, controller.get)
  .post(usersService.decodeToken, controller.post)

router.route('/:id')
  .get(usersService.decodeToken, controller.getOne)
  .put(usersService.decodeToken, controller.getOne)

router.route('/:id/voteUp')
  .put(usersService.decodeToken, usersService.getFreshUser, controller.voteUp)

router.route('/:id/voteDown')
  .put(usersService.decodeToken, usersService.getFreshUser, controller.voteDown)

module.exports = router
