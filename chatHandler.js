const { ChatModel } = require('./models/Chat');
const userSocketMap = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      userSocketMap[userId] = socket.id;
    });   

    socket.on("sync-chat", async (msg) => {
      const { sender, receiver } = msg;
      try {
        const chat = await ChatModel.syncChats(sender, receiver);
        socket.emit("sync-chat", chat);
      } catch (error) {
        console.log("Error handling sync chat:", error);
      }
    });

    socket.on("chat-message", async (msg) => {
      const { sender, senderModel, receiver, receiverModel, content } = msg;
      
      try {
        const chat = await ChatModel.findOrCreateChat(sender, senderModel, receiver, receiverModel, content);
        const receiverSocketId = userSocketMap[receiver];
        const senderSocketId = userSocketMap[sender];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("chat-message", chat);
        } if (senderSocketId) {
          io.to(senderSocketId).emit("chat-message", chat);
        }
      } catch (error) {
        console.log("Error handling chat message:", error);
      }
    });

    socket.on("mark-as-read", async (msg) => {
      const { chatId, userId } = msg;
      try {
        await ChatModel.markMessagesAsRead(chatId, userId);
        const chat = await ChatModel.syncChat(chatId);
        socket.emit("sync-chat", chat);
      } catch (error) {
        console.log("Error handling mark as read:", error);
      }
    });

    socket.on("get-all-chats", async (userId) => {
      try {
        const chats = await ChatModel.getAllChatsForUser(userId);
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
