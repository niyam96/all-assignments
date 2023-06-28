const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

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

  return res.status(200).send(`Admin ${username} created successfully`);
});

app.post('/admin/login', authenticateUser(ADMINS), (req, res) => {  
  return res.status(200).send(`Logged in successfully`);
});

app.post('/admin/courses', authenticateUser(ADMINS), (req, res) => {
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

app.put('/admin/courses/:courseId', authenticateUser(ADMINS), (req, res) => {
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

app.get('/admin/courses', authenticateUser(ADMINS), (req, res) => {
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

  return res.status(200).send(`User ${username} created successfully`);
});

app.post('/users/login', authenticateUser(USERS), (req, res) => {
  return res.status(200).send(`Logged in successfully`);
});

app.get('/users/courses', authenticateUser(USERS), (req, res) => {
  var courseList = {
    "courses": COURSES
  }

  return res.status(200).send(courseList);
});

app.post('/users/courses/:courseId', authenticateUser(USERS), (req, res) => {
  var courseId = req.params.courseId;

  if(courseId >= COURSES.length)
    return res.status(400).send(`Course with ID : ${courseId} doesn't exist`);
  
  var user = USERS.find(({username}) => username === req.headers.username);
  user.purchasedCourses.push(courseId);

  return res.status(200).send(`Course with ID : ${courseId} purchased successfully`);
});

app.get('/users/purchasedCourses', authenticateUser(USERS), (req, res) => {
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

    var user = userList.find(({username}) => username === uname);

    if(!user)
      return res.status(400).send(`Login Failed. User : ${uname} does not exist`);

    if(user.password !== password)
      return res.status(400).send(`Login failed for user : ${uname}`);

    return next();
  }
}
