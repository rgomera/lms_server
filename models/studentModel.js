const pool = require('../db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

class Student {
   constructor(fname, mname, lname, gender, email, password) {
      this.fname = fname;
      this.mname = mname;
      this.lname = lname;
      this.gender = gender;
      this.email = email;
      this.password = password;
   }

   async signup() {
      try {
         const { fname, mname, lname, gender, email, password } = this;
         const student = await pool.query('SELECT * FROM student.students WHERE student_email = $1', [email]);

         if (student.rows.length > 0) throw Error('Student is already exist!');
         else {
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password, salt);

            const sql = `INSERT INTO student.students(student_id, student_fname, student_mname, student_lname, 
                      student_gender, student_email, student_password) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
            const data = [uuid.v4(), fname, mname, lname, gender, email, bcryptPassword];
            const newStudent = await pool.query(sql, data);
            return newStudent.rows[0];
         }
      } catch (err) {
         throw err;
      }
   }

   async login() {
      try {
         const { email, password } = this;
         const student = await pool.query('SELECT * FROM student.students WHERE student_email = $1', [email]);

         if (student.rows.length === 0) throw Error('Incorrect credentials!');
         else {
            const isValidPassword = await bcrypt.compare(password, student.rows[0].student_password);
            if (!isValidPassword) throw Error('Incorrect credentials!');
            else return student.rows[0];
         }
      } catch (err) {
         throw err;
      }
   }

   async getClass(teacherId, classId) {
      try {
         const classInstance = await pool.query('SELECT * FROM teacher.get_classes($1) WHERE class_id = $2', [teacherId, classId]);
         return classInstance.rows[0];
      } catch (err) {
         throw err;
      }
   }

   async getClasses(studentId) {
      try {
         const studentClasses = await pool.query('SELECT * FROM student.get_classes($1)', [studentId]);
         return studentClasses.rows;
      } catch (err) {
         throw err;
      }
   }

   async getClassmates(studentId, teacherId, classId) {
      try {
         const data = [teacherId, studentId, classId];
         const classmates = await pool.query(`SELECT * FROM teacher.get_students($1) WHERE student_id <> $2 AND class_id = $3`, data);
         return classmates.rows;
      } catch (err) {
         throw err;
      }
   }

   async joinClass(classCodeId, studentId) {
      try {
         const classCode = await pool.query('SELECT * FROM teacher.classcodes WHERE cc_id = $1', [classCodeId]);

         if (classCode.rows.length === 0) throw Error('Class not found!');
         else {
            const student = await pool.query('SELECT * FROM teacher.students WHERE student_id = $1 AND class_id = $2', [
               studentId,
               classCode.rows[0].class_id,
            ]);
            if (student.rows.length > 0) throw Error('You already joined to this class!');
            else {
               const sql = `INSERT INTO teacher.students(student_id, teacher_id, class_id) VALUES($1,$2,$3) RETURNING *`;
               const data = [studentId, classCode.rows[0].teacher_id, classCode.rows[0].class_id];
               const newStudent = await pool.query(sql, data);
               return newStudent.rows[0];
            }
         }
      } catch (err) {
         throw err;
      }
   }
}

module.exports = Student;
