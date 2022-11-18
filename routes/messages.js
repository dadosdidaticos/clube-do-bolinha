var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user_controller')
const MessageController = require('../controllers/message_controller')

/* GET home page. */
router.get('/', UserController.home_get);

router.post('/',UserController.membership)

router.post('/message', MessageController.message_post)

module.exports = router