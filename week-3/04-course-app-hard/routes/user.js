const User = require('../models/User');
const Course = require('../models/Course');

const { generateJsonWebToken: generateJsonWebToken } = require('../middleware/auth');


module.exports.userSignup = async (req, res) => {
    var username = req.body.username;

    if (await User.findOne({ username: username }).exec())
        return res.status(400).send(`User ${username} already exists`);

    var newUser = new User(req.body);
    await newUser.save();

    var token = generateJsonWebToken(username);

    return res.status(200).send({
        message: "User created successfully",
        token: token
    });
};

module.exports.userLogin = (req, res) => {
    return res.status(200).send({
        message: "Logged in successfully",
        token: req.loginToken
    });
};

module.exports.userGetAllCourses = async (req, res) => {
    var courseList = await Course.find({}).exec()

    return res.status(200).send(courseList);
};

module.exports.userPurchaseCourse = async (req, res) => {
    try {
        var course = await Course.findById(req.params.courseId).exec()

        var user = await User.findOne({ username: req.headers.username }).exec();

        if (!user.purchasedCourses)
            user.purchasedCourses = [course._id];
        else if(user.purchasedCourses.find(c => c.equals(course._id)))
            return res.status(409).send(`Course with ID : ${course._id} already purchased by user`);
        else
            user.purchasedCourses.push(course._id);

        await user.save();

        return res.status(200).send(`Course with ID : ${course._id} purchased successfully`);

    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

module.exports.userGetPurchasedCourses = async (req, res) => {
    var user = await User.findOne({ username: req.headers.username }).populate("purchasedCourses").exec();

    return res.status(200).send({
        "purchasedCourses": user.purchasedCourses
    })
};