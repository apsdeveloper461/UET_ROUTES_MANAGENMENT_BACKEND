const { ChatModel } = require('./models/Chat');
const userSocketMap = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log("a user connected", userSocketMap);

    socket.on("register", (userId) => {
      userSocketMap[userId] = socket.id;
    });   

    socket.on("sync-chat", async (msg) => {
      const { sender, receiver } = msg;
      try {
        const chat = await ChatModel.syncChat(sender, receiver);
        // console.log("sync-chat", chat);
        
        socket.emit("sync-chat", chat);
      } catch (error) {
        console.log("Error handling sync chat:", error);
      }
    });

    socket.on("chat-message", async (msg) => {
      const { sender, senderModel, receiver, receiverModel, content } = msg;
      // console.log(msg);
      
      try {
        const chat = await ChatModel.findOrCreateChat(sender, senderModel, receiver, receiverModel, content);
        const receiverSocketId = userSocketMap[receiver];
        const senderSocketId = userSocketMap[sender];
        // console.log("receiverSocketId", chat);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("chat-message", chat);
        } if (senderSocketId) {
          io.to(senderSocketId).emit("chat-message", chat);
        }
      } catch (error) {
        console.log("Error handling chat message:", error);
      }
    });

    socket.on("get-all-chats", async (userId) => {
      try {
        // console.log("get-all-chats", userId);
        
        const chats = await ChatModel.getAllChatsForUser(userId);
        console.log("chats", chats);
        
        socket.emit("all-chats", chats);
      } catch (error) {
        console.log("Error retrieving all chats:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      for (const userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
    });
  });
};
