const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');

const student_getClasses_get = async (req, res) => {
   try {
      const id = req.user;

      const student = new Student();
      const studentClasses = await student.getClasses(id);
      res.json(studentClasses);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const student_getClassesById_get = async (req, res) => {
   try {
      const { classId, teacherId } = req.params;

      const student = new Student();
      const classInstance = await student.getClass(teacherId, classId);
      res.json(classInstance);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const student_getClassmates_get = async (req, res) => {
   try {
      const id = req.user;
      const { classId, teacherId } = req.params;

      const student = new Student();
      const classmates = await student.getClassmates(id, teacherId, classId);
      res.json(classmates);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const student_joinClass_post = async (req, res) => {
   try {
      const id = req.user;
      const { classCodeId } = req.body;

      const student = new Student();
      const newStudent = await student.joinClass(classCodeId, id);
      res.json({ student: newStudent, message: 'Joined class successfully!' });
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(409).json({ message: err.message });
   }
};

const student_leaveClass_delete = async (req, res) => {
   try {
      const id = req.user;
      const { teacherId, classId } = req.body;

      const teacher = new Teacher();
      const deletedStudent = await teacher.deleteStudentInClass(teacherId, classId, id);
      res.json({ student: deletedStudent, message: 'Leaved class successfully!' });
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(409).json({ message: err.message });
   }
};

module.exports = {
   student_getClasses_get,
   student_getClassesById_get,
   student_getClassmates_get,
   student_joinClass_post,
   student_leaveClass_delete,
};
