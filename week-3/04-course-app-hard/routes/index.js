const express = require('express')
const router = express.Router();
const { authenticateUser: authenticateUser, authorizeUser: authorizeUser } =
 require("../middleware/auth.js");

const { adminSignup, adminLogin, adminGetAllCourses,
     adminCreateCourse, adminUpdateCourse, adminDeleteCourse } = require('./admin');

const { userSignup, userLogin, userGetAllCourses,
    userPurchaseCourse, userGetPurchasedCourses } = require('./user');


router.post('/admin/signup', adminSignup);
router.post('/admin/login', authenticateUser("ADMIN"), adminLogin);
router.post('/admin/courses', authorizeUser("ADMIN"), adminCreateCourse);
router.put('/admin/courses/:courseId', authorizeUser("ADMIN"), adminUpdateCourse);
router.get('/admin/courses', authorizeUser("ADMIN"), adminGetAllCourses);
router.delete('/admin/courses/:courseId', authorizeUser("ADMIN"), adminDeleteCourse);

router.post('/users/signup', userSignup);
router.post('/users/login', authenticateUser("USER"), userLogin);
router.get('/users/courses', authorizeUser("USER"), userGetAllCourses);
router.post('/users/courses/:courseId', authorizeUser("USER"), userPurchaseCourse);
router.get('/users/purchasedCourses', authorizeUser("USER"), userGetPurchasedCourses);

module.exports = router;