const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  description: {
    type: String,
    trim: true,
    default: "No description provided.",
  },
  teacher: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teachers',
        required: true,
    }
    
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'students',
    },
  ],
  schedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    time: {
      start: { type: String },
      end: { type: String },  
    },
  },
  room: {
    type: String,
    trim: true,
    default: "Online",
  },
  isActive: {
    type: Boolean,
    default: true, 
  },
}, { timestamps: true });

const Class = mongoose.model('class', classSchema);

module.exports = Class;
