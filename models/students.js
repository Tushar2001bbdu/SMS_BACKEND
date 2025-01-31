const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentsSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    rollno: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: v => /^1210/.test(v),
            message: 'Roll number must start with 1210'
        }
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    classteacher: {
        type: String,
        required: true
    },
    teacherrollno: {
        type: Object,
        required: true
    },
    role: {
        type: String,
        default: 'student', 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profilepictureLink:{
        type: String,
        default: 'https://via.placeholder.com/150' // Default profile picture URL
    }
});

module.exports = mongoose.model('students', StudentsSchema);
