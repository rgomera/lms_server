const router = require('express').Router();
const authenticationController = require('../controllers/authenticationController');
const authorization = require('../middlewares/authorization');
const validateInfo = require('../middlewares/validateInfo');

router.post('/teacher/signup', validateInfo, authenticationController.signup_post);
router.post('/teacher/login', validateInfo, authenticationController.login_post);
router.post('/student/signup', validateInfo, authenticationController.signup_post);
router.post('/student/login', validateInfo, authenticationController.login_post);
router.get('/is-varify', authorization, authenticationController.isVarify_get);

module.exports = router;
