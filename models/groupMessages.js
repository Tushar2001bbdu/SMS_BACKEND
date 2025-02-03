const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String,required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  content: { type: String },
  type: { type: String, enum: ['text', 'image', 'video', 'file'], default: 'text' },
  mediaUrl: { type: String }, 
  timestamp: { type: Date, default: Date.now }
});

const groupMessage = mongoose.model('groupMessages', MessageSchema);
module.exports={groupMessage};