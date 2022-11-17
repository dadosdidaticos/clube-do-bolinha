var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user_controller')

/* GET root page. */
router.get('/', UserController.root_get);
//get resgister page
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Entre no Clube' });
});
//create new user
router.post('/register', UserController.create_user)

//authentication get page
router.get('/login', UserController.login_get)
//authentication post
router.post('/login', UserController.local_authentication)

//logout
router.get('/logout',UserController.user_logout)

module.exports = router;