const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResultsSchema = new Schema({
  rollno: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    default: 0,
  },
  grade: {
    type: String,
    default: "F",
  },
  attendance: {
    value: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
});
let Results = mongoose.model("studentresult", ResultsSchema);

module.exports = Results;
