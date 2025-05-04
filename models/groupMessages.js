const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: Object, required: true },
  group: { type: String, required: true},
  content: { type: String },
  type: { type: String, enum: ['text', 'image', 'video', 'file'], default: 'text' },
  mediaUrl: { type: String }, 
  timestamp: { type: Date, default: Date.now }
});

const groupMessages = mongoose.model('groupMessages', MessageSchema);
module.exports={groupMessages};