var config = {};

config.APP_STARTUP_PORT = 3000;
config.MONGODB_URI = "mongodb+srv://nino96:merncourse@cluster0.ppfl0ul.mongodb.net/course_app?retryWrites=true&w=majority"
config.JWT_TOKEN_SECRET = "CourseSellingWebsite";
config.JWT_TOKEN_EXPIRY = "2h";

module.exports = config;
