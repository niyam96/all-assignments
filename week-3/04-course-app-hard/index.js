const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

let TOKEN_SECRET = "CourseSellingWebsite";

//MongoDB stuff
let DB_URI = "mongodb+srv://nino96:merncourse@cluster0.ppfl0ul.mongodb.net/course_app?retryWrites=true&w=majority"

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(DB_URI);
}

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: String,
  password: String
});

const userSchema = new Schema({
  username: String,
  password: String,
  purchasedCourses: [{type: Schema.Types.ObjectId, ref: "Course"}]
});

const courseSchema = new Schema({
  title: String,
  description: String,
  imageLink: String,
  price: Number,
  published: Boolean,
});

const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

// Admin routes
app.post('/admin/signup', async (req, res) => {
  var username = req.body.username;

  if(await Admin.findOne({username: username}).exec())
    return res.status(400).send(`Admin user ${username} already exists`);

  var newAdminUser = new Admin(req.body);

  await newAdminUser.save();

  var token = generateJsonWebToken(username);

  return res.status(200).send({
    message: "Admin created successfully",
    token: token
  });
});

app.post('/admin/login', authenticateUser("ADMIN"), (req, res) => {  
  return res.status(200).send({
    message: "Logged in successfully",
    token: req.loginToken
  });
});

app.post('/admin/courses', authorizeUser("ADMIN"), async (req, res) => {
  var courseDetails = new Course(req.body);
  await courseDetails.save();

  return res.status(200).send({"message": "Course created successfully", "courseId": courseDetails.id});
});

app.put('/admin/courses/:courseId', authorizeUser("ADMIN"), async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authorizeUser("ADMIN"), async (req, res) => {
  var courseList = await Course.find({}).exec();
  return res.status(200).send(courseList);
});

// User routes
app.post('/users/signup', async (req, res) => {
  var username = req.body.username;

  if(await User.findOne({username: username}).exec())
    return res.status(400).send(`User ${username} already exists`);

  var newUser = new User(req.body);
  await newUser.save();

  var token = generateJsonWebToken(username);

  return res.status(200).send({
    message: "User created successfully",
    token: token
  });
});

app.post('/users/login', authenticateUser("USER"), (req, res) => {
  return res.status(200).send({
    message: "Logged in successfully",
    token: req.loginToken
  });
});

app.get('/users/courses', authorizeUser("USER"), async (req, res) => {
  var courseList = await Course.find({}).exec()

  return res.status(200).send(courseList);
});

app.post('/users/courses/:courseId', authorizeUser("USER"), async (req, res) => {
  try{
    var course = await Course.findById(req.params.courseId).exec()

    var user = await User.findOne({username: req.headers.username}).populate("purchasedCourses").exec();
    
    if(!user.purchasedCourses)
      user.purchasedCourses = [course._id];
    else
      user.purchasedCourses.push(course._id);

    await user.save();

    return res.status(200).send(`Course with ID : ${course._id} purchased successfully`);
  
  }
  catch(err)
  {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/users/purchasedCourses', authorizeUser("USER"), async (req, res) => {
  var user = await User.findOne({username: req.headers.username}).populate("purchasedCourses").exec();

  return res.status(200).send({
    "purchasedCourses": user.purchasedCourses
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

function authenticateUser(userType)
{
  return async (req, res, next) => {
    var username = req.headers.username;
    var password = req.headers.password;

    var user;

    switch(userType){
      case "ADMIN":
        user = await Admin.findOne({username: username}).exec();
        break;
      case "USER":
        user = await User.findOne({username: username}).exec();
        break;
    }

    if(!user)
      return res.status(401).send(`Login Failed. User : ${username} does not exist`);

    if(user.password !== password)
      return res.status(401).send(`Login failed for user : ${username}`);

    var token = generateJsonWebToken(user.username);
    req.loginToken = token;

    return next();
  }
}

function authorizeUser(userType){
  return (req, res, next) => {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(" ")[1];
    
    if(token == null) return res.status(401).send("Bearer token missing");

    jwt.verify(token, TOKEN_SECRET, async (err, loggedInUser) => {
      if(err){
        console.log(err);
        return res.status(403).send(err);
      }

      var user;

      switch(userType){
        case "ADMIN":
          user = await Admin.findOne({username: loggedInUser.username}).exec();
          break;
        case "USER":
          user = await User.findOne({username: loggedInUser.username}).exec();
          break;
      }

      if(!user) return res.status(401).send("User not found");

      req.headers.username = loggedInUser.username;
      return next()
    })

  }
}

function generateJsonWebToken(username)
{
  return jwt.sign({username: username}, TOKEN_SECRET, {expiresIn: "1h"});
}
