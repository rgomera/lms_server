const Dashboard = require('..//models/dashboardModel');

const dashboard_getTeacherInfo_get = async (req, res) => {
   try {
      const teacherId = req.user;
      const dashboard = new Dashboard();
      const teacherInfo = await dashboard.getTeacherInfo(teacherId);
      res.json(teacherInfo);
   } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
   }
};

const dashboard_getStudentInfo_get = async (req, res) => {
   try {
      const studentId = req.user;
      const dashboard = new Dashboard();
      const studentInfo = await dashboard.getStudentInfo(studentId);
      res.json(studentInfo);
   } catch (err) {
      onsole.error(err.message);
      res.status(500).json('Server Error');
   }
};

module.exports = {
   dashboard_getTeacherInfo_get,
   dashboard_getStudentInfo_get,
};
