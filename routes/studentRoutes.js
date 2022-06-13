const router = require('express').Router();
const studentController = require('../controllers/studentController');
const authorization = require('../middlewares/authorization');
const validateInfo = require('../middlewares/validateInfo');

router.get('/classes', authorization, studentController.student_getClasses_get);
router.get('/classes/:classId/:teacherId', authorization, studentController.student_getClassesById_get);
router.get('/classmates/:classId/:teacherId', authorization, studentController.student_getClassmates_get);
router.post('/join-class', authorization, validateInfo, studentController.student_joinClass_post);
router.delete('/leave-class', authorization, studentController.student_leaveClass_delete);

module.exports = router;
