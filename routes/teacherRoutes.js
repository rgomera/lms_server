const router = require('express').Router();
const teacherController = require('../controllers/teacherController');
const authorization = require('../middlewares/authorization');
const validateInfo = require('../middlewares/validateInfo');

router.get('/subjects', authorization, teacherController.teacher_getSubjects_get);
router.get('/subjects/count', authorization, teacherController.teacher_getSubjectCount_get);
router.put('/subjects', authorization, validateInfo, teacherController.teacher_updateSubject_put);
router.post('/subjects', authorization, validateInfo, teacherController.teacher_addSubject_post);

router.get('/classes', authorization, teacherController.teacher_getClasses_get);
router.get('/classes/count', authorization, teacherController.teacher_getClassCount_get);
router.get('/classes/:classId', authorization, teacherController.teacher_getClassesById_get);
router.put('/classes', authorization, validateInfo, teacherController.teacher_updateClass_put);
router.post('/classes', authorization, validateInfo, teacherController.teacher_addClass_post);

router.get('/students', authorization, teacherController.teacher_getStudents_get);
router.get('/students/distinct', authorization, teacherController.teacher_getDistinctStudents_get);
router.get('/students/count', authorization, teacherController.teacher_getStudentCount_get);
router.get('/students/:classId', authorization, teacherController.teacher_getStudentsByClass_get);
router.get('/students/not-exists-in-class/:classId', authorization, teacherController.teacher_getStudentsNotExistsInClass_get);
router.post('/students/:studentId/:classId', authorization, validateInfo, teacherController.teacher_addStudent_post);
router.delete('/students/:studentId/:classId', authorization, teacherController.teacher_deleteStudentInClass_delete);

router.get('/classcodes/:classCodeId/:teacherId', authorization, teacherController.teacher_getClassCode_get);
router.post('/classcodes', authorization, teacherController.teacher_addClassCode_post);

module.exports = router;
