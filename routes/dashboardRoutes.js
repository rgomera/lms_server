const router = require('express').Router();
const authorization = require('../middlewares/authorization');
const dashboardController = require('../controllers/dashboardController');

router.get('/teacher', authorization, dashboardController.dashboard_getTeacherInfo_get);
router.get('/student', authorization, dashboardController.dashboard_getStudentInfo_get);
router.use('/teachers', require('./teacherRoutes'));
router.use('/students', require('../routes/studentRoutes'));

module.exports = router;
