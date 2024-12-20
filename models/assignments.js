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
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E'],
    default: 'A'
  },

  title: {
    type: String,
    required: true,
  },
  AssignmentLink:{
    type: String,
    required: true,
    validate: {
      validator: v => /^https:\/\/[^\s]+$/.test(v),
      message: 'Invalid URL'
    }
  },
  subject: {
    type: String,
    required: true,

  },
  SolutionLink:{
    type: String,
    validate: {
      validator: v => /^https:\/\/[^\s]+$/.test(v),
      message: 'Invalid URL'
    },
    default:"#"
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

