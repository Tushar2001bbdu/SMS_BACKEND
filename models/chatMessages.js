const mongoose= require("mongoose")
const { Schema } = mongoose;
const messageSchema = new Schema({
  sender: String,
  receiver: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const message = mongoose.model('Message', messageSchema);
module.exports={message};