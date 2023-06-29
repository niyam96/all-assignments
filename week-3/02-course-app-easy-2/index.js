const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let TOKEN_SECRET = "CourseSellingWebsite";

// Admin routes
app.post('/admin/signup', (req, res) => {

  var username = req.body.username;
  var password = req.body.password;
  var newAdminUser = {
    "username": username,
    "password": password
  }

  if(ADMINS.find(user => user.username === username))
    return res.status(400).send(`Admin user ${username} already exists`);

  ADMINS.push(newAdminUser);

  var token = generateJsonWebToken(username);

  return res.status(200).send({
    message: "Admin created successfully",
    token: token
  });
});

app.post('/admin/login', authenticateUser(ADMINS), (req, res) => {  
  return res.status(200).send({
    message: "Logged in successfully",
    token: req.loginToken
  });
});

app.post('/admin/courses', authorizeUser(ADMINS), (req, res) => {
  var courseId = COURSES.length;
  var courseDetails = {
    "id": courseId,
    "title": req.body.title,
    "description": req.body.description,
    "price": req.body.price,
    "imageLink": req.body.imageLink,
    "published": req.body.published
  };

  COURSES.push(courseDetails);

  return res.status(200).send({"message": "Course created successfully", "courseId": courseId});
});

app.put('/admin/courses/:courseId', authorizeUser(ADMINS), (req, res) => {
  var courseId = req.params.courseId;

  if(courseId >= COURSES.length)
    return res.status(400).send(`Course with ID : ${courseId} doesn't exist`);
  
  COURSES[courseId].title = req.body.title;
  COURSES[courseId].description = req.body.description;
  COURSES[courseId].imageLink = req.body.imageLink;
  COURSES[courseId].price = req.body.price;
  COURSES[courseId].published = req.body.published;

  return res.status(200).send(`Course with ID : ${courseId} updated successfully`);
});

app.get('/admin/courses', authorizeUser(ADMINS), (req, res) => {
  var courseList = {
    "courses": COURSES
  }

  return res.status(200).send(courseList);
});

// User routes
app.post('/users/signup', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var newUser = {
    "username": username,
    "password": password,
    "purchasedCourses": []
  }

  if(USERS.find(user => user.username === username))
    return res.status(400).send(`User ${username} already exists`);

  USERS.push(newUser);

  var token = generateJsonWebToken(username);

  return res.status(200).send({
    message: "User created successfully",
    token: token
  });
});

app.post('/users/login', authenticateUser(USERS), (req, res) => {
  return res.status(200).send({
    message: "Logged in successfully",
    token: req.loginToken
  });
});

app.get('/users/courses', authorizeUser(USERS), (req, res) => {
  var courseList = {
    "courses": COURSES
  }

  return res.status(200).send(courseList);
});

app.post('/users/courses/:courseId', authorizeUser(USERS), (req, res) => {
  var courseId = req.params.courseId;

  if(courseId >= COURSES.length)
    return res.status(400).send(`Course with ID : ${courseId} doesn't exist`);
  
  var user = USERS.find(({username}) => username === req.headers.username);
  user.purchasedCourses.push(courseId);

  return res.status(200).send(`Course with ID : ${courseId} purchased successfully`);
});

app.get('/users/purchasedCourses', authorizeUser(USERS), (req, res) => {
  var user = USERS.find(({username}) => username === req.headers.username);

  var purchasedCourses = []
  user.purchasedCourses.forEach(courseId => {
    purchasedCourses.push(COURSES[courseId]);
  });

  return res.status(200).send({
    "purchasedCourses": purchasedCourses
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

function authenticateUser(userList)
{
  return (req, res, next) => {
    var uname = req.headers.username;
    var password = req.headers.password;

    var user = userList.find((user) => user.username === uname);

    if(!user)
      return res.status(401).send(`Login Failed. User : ${uname} does not exist`);

    if(user.password !== password)
      return res.status(401).send(`Login failed for user : ${uname}`);

    var token = generateJsonWebToken(username);
    req.loginToken = token;

    return next();
  }
}

function authorizeUser(userList){
  return (req, res, next) => {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(" ")[1];
    
    if(token == null) return res.status(401).send("Bearer token missing");

    jwt.verify(token, TOKEN_SECRET, (err, loggedInUser) => {
      if(err){
        console.log(err);
        return res.status(403).send(err);
      }

      var foundUser = userList.find((user) => user.username === loggedInUser.username);

      if(!foundUser) return res.status(401).send("User not found");

      req.headers.username = loggedInUser.username;
      return next()
    })

  }
}

function generateJsonWebToken(username)
{
  return jwt.sign({username: username}, TOKEN_SECRET, {expiresIn: "3600s"});
}
