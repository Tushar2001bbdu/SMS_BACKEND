const mongoose = require('mongoose');

const learningMaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
        },
    },
    fileType: {
        type: String,
        enum: ['pdf', 'docx', 'ppt', 'video', 'image', 'other'],
        required: true,
    },
    videoLink: {
        type: String,
        
        validate: {
            validator: function (v) {
                return v === '' || /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
        },
    },
    tags: {
        type: [String],
        default: [],
    },
    uploadedBy: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('LearningMaterial', learningMaterialSchema);
