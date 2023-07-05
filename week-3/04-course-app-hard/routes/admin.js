const Admin = require('../models/Admin');
const Course = require('../models/Course');
const { generateJsonWebToken: generateJsonWebToken } = require('../middleware/auth');

module.exports.adminSignup = async (req, res) => {
    var username = req.body.username;

    if (await Admin.findOne({ username: username }).exec())
        return res.status(400).send(`Admin user ${username} already exists`);

    var newAdminUser = new Admin(req.body);

    await newAdminUser.save();

    var token = generateJsonWebToken(username);

    return res.status(200).send({
        message: "Admin created successfully",
        token: token
    });
};

module.exports.adminLogin = (req, res) => {
    return res.status(200).send({
        message: "Logged in successfully",
        token: req.loginToken
    });
};

module.exports.adminCreateCourse = async (req, res) => {
    var courseDetails = new Course(req.body);
    await courseDetails.save();

    return res.status(200).send({ "message": "Course created successfully", "courseId": courseDetails.id });
};

module.exports.adminUpdateCourse = async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

module.exports.adminGetAllCourses = async (req, res) => {
    var courseList = await Course.find({}).exec();
    return res.status(200).send(courseList);
};