const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    purchasedCourses: [{type: Schema.Types.ObjectId, ref: "Course"}]
  });

module.exports = mongoose.model("User", userSchema);