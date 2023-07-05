const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
var config = require('../config/config');

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

    jwt.verify(token, config.JWT_TOKEN_SECRET, async (err, loggedInUser) => {
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
  return jwt.sign({username: username}, config.JWT_TOKEN_SECRET, {expiresIn: config.JWT_TOKEN_EXPIRY});
}

module.exports = {
    authenticateUser,
    authorizeUser,
    generateJsonWebToken
}