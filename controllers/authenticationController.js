const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');
const jwtGenerator = require('../utils/jwtGenerator');

const signup_post = async (req, res) => {
   try {
      const path = req.path;
      const { fname, mname, lname, gender, email, password } = req.body;

      switch (path) {
         case '/teacher/signup':
            const teacher = new Teacher(fname, mname, lname, gender, email, password);
            const newTeacher = await teacher.signup();

            const teacherToken = jwtGenerator(newTeacher.teacher_id);
            res.json({ token: teacherToken, message: 'Teacher sign up successfully!' });
            break;

         case '/student/signup':
            const student = new Student(fname, mname, lname, gender, email, password);
            const newStudent = await student.signup();

            const studentToken = jwtGenerator(newStudent.student_id);
            res.json({ token: studentToken, message: 'Student sign up successfully!' });
            break;
      }
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(403).json({ message: err.message });
   }
};

const login_post = async (req, res) => {
   try {
      const path = req.path;
      const { email, password } = req.body;

      switch (path) {
         case '/teacher/login':
            const teacher = new Teacher('', '', '', '', email, password);
            const teacherInfo = await teacher.login();

            const teacherToken = jwtGenerator(teacherInfo.teacher_id);
            res.json({ token: teacherToken, message: 'Teacher login successfully!' });
            break;

         case '/student/login':
            const student = new Student('', '', '', '', email, password);
            const studentInfo = await student.login();

            const studentToken = jwtGenerator(studentInfo.student_id);
            res.json({ token: studentToken, message: 'Student login successfully!' });
            break;
      }
   } catch (err) {
      if (err.severity === 'ERROR') {
         console.log(err.message);
         res.status(500).send('Server Error');
      } else res.status(403).json({ message: err.message });
   }
};

const isVarify_get = (req, res) => {
   try {
      res.json(true);
   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
   }
};

module.exports = {
   signup_post,
   login_post,
   isVarify_get,
};
