const express = require('express')
const router = express.Router()
const { controller } = require('./controller')

router.post('/', controller.createController)
router.get('/', controller.resultsController)

module.exports = router
