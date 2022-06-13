module.exports = (req, res, next) => {
   const { name, studentId, fname, mname, lname, gender, email, password, cpassword, classId, subjectId, classCodeId } = req.body;
   const path = req.path;
   const method = req.method;
   console.log('path = ', path);

   const isEmailValid = userEmail => {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
   };
   const isPasswordValid = userPassword => {
      return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(userPassword);
   };

   if ((path === '/teacher/signup' && method === 'POST') || (path === '/student/signup' && method === 'POST')) {
      if (!fname || !lname || !gender || !email || !password || !cpassword) return res.status(403).json({ message: 'Missing Credentials!' });
      else if (!isEmailValid(email)) return res.status(403).json({ message: 'Invalid email!' });
      else if (!isPasswordValid(password)) return res.status(403).json({ message: 'Password does not meet requirements!' });
      else if (password !== cpassword) return res.status(403).json({ message: 'Confirm password does not match!' });
   } else if ((path === '/teacher/login' && method === 'POST') || (path === '/student/login' && method === 'POST')) {
      if (!email || !password) return res.status(403).json({ message: 'Missing Credentials!' });
      else if (!isEmailValid(email)) return res.status(403).json({ message: 'Invalid email!' });
   } else if (path === '/students' && method === 'POST') {
      if (!studentId || !classId) return res.status(409).json({ message: 'Missing Credentials!' });
   } else if (path === '/classes' && method === 'POST') {
      if (!name || !subjectId) return res.status(409).json({ message: 'Missing Credentials!' });
   } else if (path === '/classes' && method === 'PUT') {
      if (!name || !subjectId || !classId) return res.status(409).json({ message: 'Missing Credentials!' });
   } else if (path === '/subjects' && method === 'POST') {
      if (!name) return res.status(409).json({ message: 'Missing Credentials!' });
   } else if (path === '/subjects' && method === 'PUT') {
      if (!name || !subjectId) return res.status(409).json({ message: 'Missing Credentials!' });
   } else if (path === '/join-class') {
      if (!classCodeId) return res.status(409).json({ message: 'Missing Credentials!' });
   }

   next();
};
