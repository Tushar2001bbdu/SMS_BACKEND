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
                const regex = /^https:\/\/assignment-solutions\.s3\.ap-south-1\.amazonaws\.com\/A/;
                return regex.test(v);
            },
            message: props => `${props.value} is not a valid file URL! It must start with "https://assignment-solutions.s3.ap-south-1.amazonaws.com/A".`,
        },
    },
    fileType: {
        type: String,
        enum: ['application/pdf', 'application/docx', 'application/ppt', 'application/video', 'application/image', 'other'],
        required: true,
    },
    videoLink: {
        type: String,
        validate: {
            validator: function (v) {
                return (
                    v === '' || 
                    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[^\s&]+$/.test(v)
                );
            },
            message: props => `${props.value} is not a valid YouTube URL!`,
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
