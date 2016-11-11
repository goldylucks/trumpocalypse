const router = require('express').Router()

router.use('/users', require('./users/usersRoutes'))
router.use('/scenarios', require('./scenarios/scenariosRoutes'))
router.use('/comments', require('./comments/commentsRoutes'))

module.exports = router
