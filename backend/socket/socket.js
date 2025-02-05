// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import Message from "../models/messageModel.js";
// import Conversation from "../models/conversationModel.js";
// import { generateResult } from "../utils/helpers/AI.js";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// const userSocketMap = {}; // userId: socketId

// export const getRecipientSocketId = (recipientId) => {
//   return userSocketMap[recipientId];
// };

// io.on("connection", (socket) => {
//   console.log("user connected", socket.id);
//   const userId = socket.handshake.query.userId;

//   if (userId !== "undefined") userSocketMap[userId] = socket.id;
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("newMessage", async (data) => {
//     try {
//       console.log("Received new message:", data);
//       const { conversationId, senderId, message } = data;
//       console.log("Received message:", message);
//       const aiIsPresentInMessage = message.includes("@ai");

//       const newMessage = new Message({
//         conversationId,
//         sender: senderId,
//         text: message,
//       });
//       const savedMessage = await newMessage.save();

//       await Conversation.updateOne(
//         { _id: conversationId },
//         {
//           lastMessage: {
//             text: message,
//             sender: senderId,
//           },
//         }
//       );

//       io.to(conversationId).emit("project-message", {
//         ...savedMessage.toObject(),
//         conversationId,
//       });

//       if (aiIsPresentInMessage) {
//         const prompt = message.replace("@ai", "").trim();
//         console.log("AI prompt:", prompt);

//         try {
//           const aiResponse = await generateResult(prompt);
//           console.log("AI response:", aiResponse);

//           const aiMessage = new Message({
//             conversationId,
//             sender: "ai",
//             text: aiResponse,
//           });
//           const savedAiMessage = await aiMessage.save();

//           io.to(conversationId).emit("project-message", {
//             ...savedAiMessage.toObject(),
//             conversationId,
//           });
//         } catch (aiError) {
//           console.error("Error generating AI response:", aiError.message);
//         }
//       }
//     } catch (error) {
//       console.error("Error handling new message:", error.message);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected:", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });


// export { io, server, app };

import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { generateResult } from "../utils/helpers/AI.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // userId: socketId

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("newMessage", async (data) => {
    try {
      console.log("Received new message:", data);
      const { conversationId, senderId, message } = data;
      console.log("Received message:", message);
      const aiIsPresentInMessage = message.includes("@ai");

      const newMessage = new Message({
        conversationId,
        sender: senderId,
        text: message,
      });
      const savedMessage = await newMessage.save();

      await Conversation.updateOne(
        { _id: conversationId },
        {
          lastMessage: {
            text: message,
            sender: senderId,
          },
        }
      );

      io.to(conversationId).emit("project-message", {
        ...savedMessage.toObject(),
        conversationId,
      });

      if (aiIsPresentInMessage) {
        const prompt = message.replace("@ai", "").trim();;
        console.log("AI prompt:", prompt);

        try {
          const aiResponse = await generateResult(prompt);
          console.log("AI response:", aiResponse);

          const aiMessage = new Message({
            conversationId,
            sender: "ai",
            text: aiResponse,
          });
          const savedAiMessage = await aiMessage.save();

          io.to(conversationId).emit("project-message", {
            ...savedAiMessage.toObject(),
            conversationId: conversationId.toString(),
            sender: "ai",
          });
          console.log("Emitted AI response:", savedAiMessage.toObject());
        } catch (aiError) {
          console.error("Error generating AI response:", aiError.message);
        }
      }
    } catch (error) {
      console.error("Error handling new message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };