var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user_controller')

/* GET home page. */
router.get('/', UserController.home_get);

router.post('/',UserController.membership)

module.exports = router