const mongoose = require("mongoose");
const { Schema } = mongoose;

const TeachersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    rollno: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: v => /^22/.test(v),
            message: 'Roll number must start with 22'
        }
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'teacher', // Automatically set to 'teacher'
    },
    attendance: {
        value: {
            type: Number,
            default: 0,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    studentslist: {
        type: [Number],
        ref: "students",
    },
});

module.exports = mongoose.model("Teachers", TeachersSchema);


