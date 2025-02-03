const SOCKETIO = require("socket.io");
const { message } = require("../models/chatMessages");
const { groupMessage } = require("../models/groupMessages");


function initializeWebSocket(server) {
  const io = SOCKETIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const clients = new Set();
  const userSocketMap = {};
  const groupChat = io.of('/group-chat');
  groupChat.on('start-connection', socket => {
    console.log(`New Memmber connected: ${socket.user.id}`);
  
    socket.on('join-group', ({ groupId }) => {
      socket.join(groupId);
      console.log(`User joined group: ${groupId}`);
    });
  
    socket.on('send-message', async ({ groupId, message }) => {
      const newMessage = new Message({ sender: socket.user.id, group: groupId, content: message });
      await newMessage.save();
      groupChat.to(groupId).emit('new-message', { groupId, message });
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("start-group-chat",(socket)=>{
      console.log("Group chat started with ", socket.id);
      clients.add(socket.id);
      socket.on("message", (message) => {
        console.log("Received message from group chat:", message);
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
         socket.to(client).emit("message", message);
      }
  })
      });
      socket.on("disconnect", () => {
        console.log("Client disconnected");
        clients.delete(socket.id);
      });
    });
  
    socket.on("register", (userId) => {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} is registered with socket ID: ${socket.id}`);
    });
    socket.on("send_message", async (messageData) => {
      const newMessage = new message(messageData);
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
  });}

module.exports = { initializeWebSocket };
