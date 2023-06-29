const express = require('express');
const jwt = require('jsonwebtoken');
const { promises: fs, read } = require('fs');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

ADMINS_FILE = "./files/admins.json";
USERS_FILE = "./files/users.json";
COURSES_FILE = "./files/courses.json";

// Admin routes
let TOKEN_SECRET = "CourseSellingWebsite";

// Admin routes
app.post('/admin/signup', readFileMiddleware("ADMINS"), async (req, res) => {

  var username = req.body.username;
  var password = req.body.password;
  var newAdminUser = {
    "username": username,
    "password": password
  }

  if(ADMINS.find(user => user.username === username))
    return res.status(400).send(`Admin user ${username} already exists`);

  ADMINS.push(newAdminUser);

  await writeDataToFile(ADMINS_FILE, ADMINS);

  var token = generateJsonWebToken(username);

  return res.status(200).send({
    message: "Admin created successfully",
    token: token
  });
});

app.post('/admin/login', readFileMiddleware("ADMINS"), authenticateUser("ADMINS"), (req, res) => {  
  return res.status(200).send({
    message: "Logged in successfully",
    token: req.loginToken
  });
});

app.post('/admin/courses', readFileMiddleware("ADMINS"), authorizeUser("ADMINS"), async (req, res) => {
  var courseId = COURSES.length;
  var courseDetails = {
    "id": courseId,
    "title": req.body.title,
    "description": req.body.description,
    "price": req.body.price,
    "imageLink": req.body.imageLink,
    "published": req.body.published
  };

  await populateListFromFile("COURSES");

  COURSES.push(courseDetails);

  await writeDataToFile(COURSES_FILE, COURSES);

  return res.status(200).send({"message": "Course created successfully", "courseId": courseId});
});

app.put('/admin/courses/:courseId', readFileMiddleware("ADMINS"), authorizeUser("ADMINS"), async (req, res) => {
  var courseId = req.params.courseId;

  await populateListFromFile("COURSES");

  if(courseId >= COURSES.length)
    return res.status(400).send(`Course with ID : ${courseId} doesn't exist`);
  
  COURSES[courseId].title = req.body.title;
  COURSES[courseId].description = req.body.description;
  COURSES[courseId].imageLink = req.body.imageLink;
  COURSES[courseId].price = req.body.price;
  COURSES[courseId].published = req.body.published;

  await writeDataToFile(COURSES_FILE, COURSES);

  return res.status(200).send(`Course with ID : ${courseId} updated successfully`);
});

app.get('/admin/courses', readFileMiddleware("ADMINS"), authorizeUser("ADMINS"), async (req, res) => {
  
  await populateListFromFile("COURSES");
  
  var courseList = {
    "courses": COURSES
  }

  return res.status(200).send(courseList);
});

// User routes
app.post('/users/signup', readFileMiddleware("USERS"), async (req, res) => {
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

  await writeDataToFile(USERS_FILE, USERS);

  var token = generateJsonWebToken(username);

  return res.status(200).send({
    message: "User created successfully",
    token: token
  });
});

app.post('/users/login', readFileMiddleware("USERS"), authenticateUser("USERS"), (req, res) => {
  return res.status(200).send({
    message: "Logged in successfully",
    token: req.loginToken
  });
});

app.get('/users/courses', readFileMiddleware("USERS"), authorizeUser("USERS"), async (req, res) => {

  await populateListFromFile("COURSES");

  var courseList = {
    "courses": COURSES
  }

  return res.status(200).send(courseList);
});

app.post('/users/courses/:courseId', readFileMiddleware("USERS"), authorizeUser("USERS"), async (req, res) => {
  var courseId = req.params.courseId;

  await populateListFromFile("COURSES");

  if(courseId >= COURSES.length)
    return res.status(400).send(`Course with ID : ${courseId} doesn't exist`);
  
  var user = USERS.find(({username}) => username === req.headers.username);
  user.purchasedCourses.push(courseId);

  await writeDataToFile(USERS_FILE, USERS);

  return res.status(200).send(`Course with ID : ${courseId} purchased successfully`);
});

app.get('/users/purchasedCourses', readFileMiddleware("USERS"), authorizeUser("USERS"), async (req, res) => {

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

function authenticateUser(userListName)
{
  return (req, res, next) => {
    
    var userList = getListFromName(userListName);
    console.log(userList);

    var uname = req.headers.username;
    var password = req.headers.password;

    var user = userList.find((user) => user.username === uname);

    if(!user)
      return res.status(401).send(`Login Failed. User : ${uname} does not exist`);

    if(user.password !== password)
      return res.status(401).send(`Login failed for user : ${uname}`);

    var token = generateJsonWebToken(user.username);
    req.loginToken = token;

    return next();
  }
}

function authorizeUser(userListName){
  return (req, res, next) => {

    var userList = getListFromName(userListName);

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
      return next();
    })

  }
}

function generateJsonWebToken(username)
{
  return jwt.sign({username: username}, TOKEN_SECRET, {expiresIn: "3600s"});
}

async function readDataFromFile(filePath)
{
  var data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function populateListFromFile(listToPopulate) {
  try {
    var filePath = "";

    switch(listToPopulate){
      case "ADMINS":
        filePath = ADMINS_FILE;
        ADMINS = await readDataFromFile(filePath);
        console.log(ADMINS);
        break;
      case "USERS":
        filePath = USERS_FILE;
        USERS = await readDataFromFile(filePath);
        break;
      case "COURSES":
        filePath = COURSES_FILE;
        COURSES = await readDataFromFile(filePath);
        break;
    }
  }
  catch (err) {
    console.log(err);
  }
}

function getListFromName(listName){
  var dataList = [];

  switch(listName)
    {
      case "ADMINS":
        dataList = ADMINS;
        break;
      case "USERS":
        dataList = USERS;
        break;
      case "COURSES":
        dataList = COURSES;
        break;
    }

  return dataList;
}

function readFileMiddleware(listToPopulate){
  return async (req, res, next) => {
    try {
      await populateListFromFile(listToPopulate);
      return next();
    }
    catch (err) {
      console.log(err);
      return next();
    }
  }
}

async function writeDataToFile(filePath, listToWrite) {
  try {
    var contentToWrite = JSON.stringify(listToWrite);
    await fs.writeFile(filePath, contentToWrite);
  }
  catch (err) {
    console.log(err);
  }
}
