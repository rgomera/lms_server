const Teacher = require('../models/teacherModel');

const teacher_getSubjects_get = async (req, res) => {
   try {
      const id = req.user;

      const teacher = new Teacher();
      const subjects = await teacher.getSubjects(id);
      res.json(subjects);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_getSubjectCount_get = async (req, res) => {
   try {
      const id = req.user;

      const teacher = new Teacher();
      const count = await teacher.getSubjectCount(id);
      res.json(count);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_updateSubject_put = async (req, res) => {
   try {
      const id = req.user;
      const { name, subjectId } = req.body;

      const teacher = new Teacher();
      const updatedSubject = await teacher.updateSubject(id, subjectId, name);
      res.json({ subject: updatedSubject, message: 'Subject updated successfully!' });
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(409).json({ message: err.message });
   }
};

const teacher_addSubject_post = async (req, res) => {
   try {
      const id = req.user;
      const { name } = req.body;

      const teacher = new Teacher();
      const subject = await teacher.addSubject(id, name);
      res.json({ subject, message: 'Subject added successfully!' });
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(409).json({ message: err.message });
   }
};

const teacher_getClasses_get = async (req, res) => {
   try {
      const id = req.user;

      const teacher = new Teacher();
      const classes = await teacher.getClasses(id);
      res.json(classes);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_getClassesById_get = async (req, res) => {
   try {
      const id = req.user;
      const { classId } = req.params;

      const teacher = new Teacher();
      const classInstance = await teacher.getClass(id, classId);
      res.json(classInstance);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_getClassCount_get = async (req, res) => {
   try {
      const id = req.user;

      const teacher = new Teacher();
      const count = await teacher.getClassCount(id);
      res.json(count);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_updateClass_put = async (req, res) => {
   try {
      const id = req.user;
      const { name, subjectId, section, classId } = req.body;

      const teacher = new Teacher();
      const updatedClass = await teacher.updateClass(classId, id, subjectId, name, section);
      res.json({ class: updatedClass, message: 'Class updated successfully!' });
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(409).json({ message: err.message });
   }
};

const teacher_addClass_post = async (req, res) => {
   try {
      const id = req.user;
      const { name, subjectId, section } = req.body;

      const teacher = new Teacher();
      const newClass = await teacher.addClass(id, subjectId, name, section);
      res.json({ class: newClass, message: 'Class added successfully!' });
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(409).json({ message: err.message });
   }
};

const teacher_getClassCode_get = async (req, res) => {
   try {
      const { classCodeId, teacherId } = req.params;
      const teacher = new Teacher();
      const classCode = await teacher.getClassCode(classCodeId, teacherId);
      res.json(classCode);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_addClassCode_post = async (req, res) => {
   try {
      const id = req.user;
      const { classId } = req.body;

      const teacher = new Teacher();
      const newClassCode = await teacher.addClassCodes(id, classId);
      res.json(newClassCode);
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(409).json({ message: err.message });
   }
};

const teacher_getStudents_get = async (req, res) => {
   try {
      const id = req.user;

      const teacher = new Teacher();
      const students = await teacher.getStudents(id);
      res.json(students);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_getDistinctStudents_get = async (req, res) => {
   try {
      const id = req.user;

      const teacher = new Teacher();
      const students = await teacher.getDistinctStudents(id);
      res.json(students);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_getStudentsByClass_get = async (req, res) => {
   try {
      const id = req.user;
      const { classId } = req.params;

      const teacher = new Teacher();
      const students = await teacher.getStudentsByClass(id, classId);
      res.json(students);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_getStudentsNotExistsInClass_get = async (req, res) => {
   try {
      const id = req.user;
      const { classId } = req.params;

      const teacher = new Teacher();
      const notExistsStudents = await teacher.getStudentsNotExistsInClass(id, classId);
      res.json(notExistsStudents);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_getStudentCount_get = async (req, res) => {
   try {
      const id = req.user;

      const teacher = new Teacher();
      const count = await teacher.getStudentCount(id);
      res.json(count);
   } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
   }
};

const teacher_addStudent_post = async (req, res) => {
   try {
      const id = req.user;
      const { studentId, classId } = req.params;
      const student = await { studentId, classId, teacherId: id };

      const teacher = new Teacher();
      const newStudent = await teacher.addStudent(student);
      res.json({ student: newStudent, message: 'Student added successfully!' });
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(409).json({ message: err.message });
   }
};

const teacher_deleteStudentInClass_delete = async (req, res) => {
   try {
      const id = req.user;
      const { studentId, classId } = req.params;

      const teacher = new Teacher();
      const deletedStudent = await teacher.deleteStudentInClass(id, classId, studentId);
      res.json({ student: deletedStudent, message: 'Student removed successfully!' });
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(409).json({ message: err.message });
   }
};

module.exports = {
   teacher_getSubjects_get,
   teacher_getSubjectCount_get,
   teacher_updateSubject_put,
   teacher_addSubject_post,
   teacher_getClasses_get,
   teacher_getClassesById_get,
   teacher_getClassCount_get,
   teacher_updateClass_put,
   teacher_addClass_post,
   teacher_getClassCode_get,
   teacher_addClassCode_post,
   teacher_getStudents_get,
   teacher_getDistinctStudents_get,
   teacher_getStudentCount_get,
   teacher_getStudentsByClass_get,
   teacher_getStudentsNotExistsInClass_get,
   teacher_addStudent_post,
   teacher_deleteStudentInClass_delete,
};
