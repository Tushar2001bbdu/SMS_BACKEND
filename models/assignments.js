const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  rollno: {
    type: String,
    required: true,
    unique:false
  },
  section:{
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true,
  },
  assignmentLink:{
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const regex = /^https:\/\/assignmentsquestions\.s3\.ap-south-1\.amazonaws\.com/;
        return regex.test(v);
    },
    message: props => `${props.value} is not a valid file URL! It must start with "https://student-assignment-questions.s3.ap-south-1.amazonaws.com/A".`,
},
    },
  subject: {
    type: String,
    required: true,

  },
  solutionLink:{
    type: String,
    validate: {
      validator: v => /^https:\/\/[^\s]+$/.test(v),
      message: 'Invalid URL'
    },
    default:"https://www.google.co.in/"
  },
  assignmentDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dueDate: {
    type: Date,
    required: true,
  },
  marks: {
    type: Number,
    default: 0,
  },
  postedBy: {
    type: String,
    default: Date.now(),
  },
  submitted: {
    type: Boolean,
    default: false,
  }
},
);
let assignments = mongoose.model("assignments", schema);
module.exports = assignments;

