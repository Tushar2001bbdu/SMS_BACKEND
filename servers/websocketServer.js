const SOCKETIO = require("socket.io");
const { message } = require("../models/chatMessages");
const { groupMessage } = require("../models/groupMessages");
const { encryptMessage } = require("../utils/chatsecurity.js");

function initializeWebSocket(server) {
  const io = SOCKETIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = {};
  const groupChat = io.of('/group-chat');
  groupChat.on('connection', socket => {
    console.log(`New Memmber connected: ${socket.id}`);

    socket.on('join-group', ({ groupId }) => {
      console.log(groupId)
      socket.join(groupId);
      console.log(`User joined group: ${groupId}`);
    });

    socket.on('send-message', async ({ message }) => {
      let groupId = message.receiver;
      console.log(groupId)
      const newMessage = new groupMessage({ sender: message.sender, group: message.receiver, content: encryptMessage(message.content), mediaUrl: message.mediaUrl === null ? "" : encryptMessage(message.mediaUrl) });
      await newMessage.save();
      console.log(newMessage)
      groupChat.to(groupId).emit('new-message', { message });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  const privateChat = io.of('/private-chat');
  privateChat.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("register", (userId) => {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} is registered with socket ID: ${socket.id}`);
    });
    socket.on("send_message", async (messageData) => {
      let {sender,receiver,content,timestamp}=messageData;
      const newMessage = new message({sender:sender,receiver:receiver,content:encryptMessage(content),timestamp:timestamp});
      await newMessage.save();

      const receiverSocketId = userSocketMap[messageData.receiver];
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit("receive_message", messageData);
      } else {
        console.log("Receiver is not connected");
      }
    });



    socket.on("end-chat", () => {
      console.log("Client disconnected");
    });
  });
}

module.exports = { initializeWebSocket };
