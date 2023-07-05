const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: String,
    description: String,
    imageLink: String,
    price: Number,
    published: Boolean,
  });

module.exports = mongoose.model("Course", courseSchema);