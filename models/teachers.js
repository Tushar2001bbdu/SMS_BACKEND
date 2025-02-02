const mongoose = require("mongoose");
const { Schema } = mongoose;

const TeachersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
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
        default: 'teacher',
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
    allotedSections:{
        type:[String],
    },
    studentslist: {
        type: [Object]
    },
    profilepictureLink:{
        type: String,
        default: 'https://via.placeholder.com/150'
    }
});

module.exports = mongoose.model("Teachers", TeachersSchema);


