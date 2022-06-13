const pool = require('../db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

class Teacher {
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
         const teacher = await pool.query('SELECT * FROM teacher.teachers WHERE teacher_email = $1', [email]);

         if (teacher.rows.length > 0) throw Error('Teacher is already exist!');
         else {
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password, salt);

            const sql = `INSERT INTO teacher.teachers(teacher_id, teacher_fname, teacher_mname, teacher_lname, 
                    teacher_gender, teacher_email, teacher_password) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
            const data = [uuid.v4(), fname, mname, lname, gender, email, bcryptPassword];
            const newTeacher = await pool.query(sql, data);
            return newTeacher.rows[0];
         }
      } catch (err) {
         throw err;
      }
   }

   async login() {
      try {
         const { email, password } = this;
         const teacher = await pool.query('SELECT * FROM teacher.teachers WHERE teacher_email = $1', [email]);

         if (teacher.rows.length === 0) throw Error('Incorrect credentials!');
         else {
            const isValidPassword = await bcrypt.compare(password, teacher.rows[0].teacher_password);
            if (!isValidPassword) throw Error('Incorrect credentials!');
            else return teacher.rows[0];
         }
      } catch (err) {
         throw err;
      }
   }

   async getSubjects(teacherId) {
      try {
         const subjects = await pool.query('SELECT * FROM teacher.subjects WHERE teacher_id = $1 ORDER BY subject_name', [teacherId]);
         return subjects.rows;
      } catch (err) {
         throw err;
      }
   }

   async getSubjectCount(teacherId) {
      try {
         const subjectCount = await pool.query('SELECT teacher.count_subject($1)', [teacherId]);
         return subjectCount.rows[0].count_subject;
      } catch (err) {
         throw err;
      }
   }

   async updateSubject(teacherId, subjectId, subjectName) {
      try {
         const subject = await pool.query('SELECT * FROM teacher.subjects WHERE subject_name = $1 AND teacher_id = $2 AND subject_id != $3', [
            subjectName,
            teacherId,
            subjectId,
         ]);
         if (subject.rows.length > 0) throw Error('Subject already exist!');
         else {
            const sql = 'UPDATE teacher.subjects SET subject_name = $1 WHERE subject_id = $2 RETURNING *';
            const data = [subjectName, subjectId];
            const updatedSubject = await pool.query(sql, data);
            return updatedSubject.rows[0];
         }
      } catch (err) {
         throw err;
      }
   }

   async addSubject(teacherId, subjectName) {
      try {
         const subject = await pool.query('SELECT * FROM teacher.subjects WHERE subject_name = $1 AND teacher_id = $2', [subjectName, teacherId]);
         if (subject.rows.length > 0) throw Error('Subject already exist!');
         else {
            const sql = `INSERT INTO teacher.subjects(subject_id, subject_name, teacher_id) VALUES($1,$2,$3) RETURNING *`;
            const data = [uuid.v4(), subjectName, teacherId];
            const newSubject = await pool.query(sql, data);
            return newSubject.rows[0];
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

   async getClasses(teacherId) {
      try {
         const classes = await pool.query('SELECT * FROM teacher.get_classes($1)', [teacherId]);
         return classes.rows;
      } catch (err) {
         throw err;
      }
   }

   async getClassCount(teacherId) {
      try {
         const classCount = await pool.query('SELECT teacher.count_class($1)', [teacherId]);
         return classCount.rows[0].count_class;
      } catch (err) {
         throw err;
      }
   }

   async updateClass(classId, teacherId, subjectId, className, section) {
      try {
         const classInstance = await pool.query('SELECT * FROM teacher.classes WHERE class_name = $1 AND teacher_id = $2 AND class_id != $3', [
            className,
            teacherId,
            classId,
         ]);
         if (classInstance.rows.length > 0) throw Error('Class already exist!');
         else {
            const subjectName = await pool.query('SELECT subject_name FROM teacher.subjects WHERE subject_id = $1', [subjectId]);
            const sql = `UPDATE teacher.classes SET class_name = $1, subject_id = $2,
                        class_section = $3 WHERE class_id = $4 RETURNING *
                        `;
            const data = [className, subjectId, section, classId];
            const updatedClass = await pool.query(sql, data);
            return { ...updatedClass.rows[0], ...subjectName.rows[0] };
         }
      } catch (err) {
         throw err;
      }
   }

   async addClass(teacherId, subjectId, className, section) {
      try {
         const classInstance = await pool.query('SELECT * FROM teacher.classes WHERE class_name = $1 AND teacher_id = $2 AND subject_id = $3', [
            className,
            teacherId,
            subjectId,
         ]);
         if (classInstance.rows.length > 0) throw Error('Class already exist!');
         else {
            const subjectName = await pool.query('SELECT subject_name FROM teacher.subjects WHERE subject_id = $1', [subjectId]);
            const sql = `INSERT INTO teacher.classes(class_id, class_name, teacher_id, subject_id, class_school_year, class_section)
            VALUES($1,$2,$3,$4,(SELECT teacher.getacademic_year()), $5) RETURNING *`;
            const data = [uuid.v4(), className, teacherId, subjectId, section];
            const newClass = await pool.query(sql, data);
            return { ...newClass.rows[0], ...subjectName.rows[0] };
         }
      } catch (err) {
         throw err;
      }
   }

   async getClassCode(classCodeId, teacherId) {
      try {
         const classCode = await pool.query('SELECT * FROM teacher.classcodes WHERE class_id = $1 AND teacher_id = $2', [classCodeId, teacherId]);
         return classCode.rows[0];
      } catch (err) {
         throw err;
      }
   }

   async addClassCodes(teacherId, classId) {
      try {
         const checkClassCode = await pool.query('SELECT * FROM teacher.classcodes WHERE teacher_id = $1 AND class_id = $2', [teacherId, classId]);

         if (checkClassCode.rows.length > 0) throw Error('Class code already exist!');

         // if dili maayo and UUID, instead use  Date.now()
         const sql = 'INSERT INTO teacher.classcodes(cc_id, class_id, teacher_id) VALUES($1, $2, $3) RETURNING *';
         const classCode = await pool.query(sql, [uuid.v4(), classId, teacherId]);
         return classCode.rows[0];
      } catch (err) {
         throw err;
      }
   }

   async getStudents(teacherId) {
      try {
         const students = await pool.query('SELECT * FROM teacher.get_students($1)', [teacherId]);
         return students.rows;
      } catch (err) {
         throw err;
      }
   }

   async getDistinctStudents(teacherId) {
      try {
         const sql = `SELECT DISTINCT student_id FROM teacher.get_students($1)`;
         const students = await pool.query(sql, [teacherId]);
         return students.rows;
      } catch (err) {
         throw err;
      }
   }

   async getStudentsByClass(teacherId, classId) {
      try {
         const students = await pool.query(`SELECT * FROM teacher.get_students($1) WHERE class_id = $2`, [teacherId, classId]);
         return students.rows;
      } catch (err) {
         throw err;
      }
   }

   async getStudentsNotExistsInClass(teacherId, classId) {
      try {
         const notExistStudent = await pool.query('SELECT * FROM teacher.get_student_not_exist_in_class($1,$2)', [teacherId, classId]);
         return notExistStudent.rows;
      } catch (err) {
         throw err;
      }
   }

   async getStudentCount(teacherId) {
      try {
         const studentCount = await pool.query('SELECT teacher.count_student($1)', [teacherId]);
         return studentCount.rows[0].count_student;
      } catch (err) {
         throw err;
      }
   }

   async addStudent(studentObj) {
      try {
         const { studentId, teacherId, classId } = studentObj;
         const student = await pool.query('SELECT * FROM teacher.students WHERE student_id = $1 AND class_id = $2', [studentId, classId]);
         if (student.rows.length > 0) throw Error('Student already exist!');
         else {
            const sql = `INSERT INTO teacher.students(student_id, teacher_id, class_id) VALUES($1,$2,$3) RETURNING *`;
            const data = [studentId, teacherId, classId];
            const newStudent = await pool.query(sql, data);
            return newStudent.rows[0];
         }
      } catch (err) {
         throw err;
      }
   }

   async deleteStudentInClass(teacherId, classId, studentId) {
      try {
         const student = await pool.query('SELECT * FROM teacher.students WHERE student_id = $1 AND teacher_id = $2 AND class_id = $3', [
            studentId,
            teacherId,
            classId,
         ]);
         if (student.rows.length === 0) throw Error('Student does not exist!');
         else {
            const sql = 'DELETE FROM teacher.students WHERE student_id = $1 AND teacher_id = $2 AND class_id = $3 RETURNING *';
            const data = [studentId, teacherId, classId];
            const deletedStudent = await pool.query(sql, data);
            return deletedStudent.rows[0];
         }
      } catch (err) {
         throw err;
      }
   }
}

module.exports = Teacher;
