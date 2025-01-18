const mongoose = require('mongoose');
const validator=require('validator');

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
                const regex = /^https:\/\/assignmentsolutions\.s3\.ap-south-1\.amazonaws\.com/;
                return regex.test(v);
            },
            message: props => `${props.value} is not a valid file URL! It must start with "https://assignmentsolutions.s3.ap-south-1.amazonaws.com/A".`,
        },
    },
    fileType: {
        type: String,
        enum: ['text/plain', 'applicatiion/docx', 'application/ppt', 'application/video', 'application/image', 'other'],
        required: true,
    },
    videoLink: {
        type: String,
        validate: {
          validator: function (v) {
            return (
              v === '' || 
              (validator.isURL(v) && 
               (v.includes('youtube.com/watch?v=') || v.includes('youtu.be/')))
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
