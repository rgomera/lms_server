const pool = require('../db');

class Dashboard {
   async getTeacherInfo(id) {
      try {
         const sql = `SELECT teacher_id, teacher_fname, teacher_mname, teacher_lname, teacher_gender, teacher_email FROM teacher.teachers WHERE teacher_id = $1`;
         const teacher = await pool.query(sql, [id]);
         return teacher.rows[0];
      } catch (err) {
         throw err;
      }
   }

   async getStudentInfo(id) {
      try {
         const sql =
            'SELECT student_id, student_fname, student_mname, student_lname, student_gender, student_email FROM student.students WHERE student_id = $1';
         const student = await pool.query(sql, [id]);
         return student.rows[0];
      } catch (err) {
         throw err;
      }
   }
}

module.exports = Dashboard;
