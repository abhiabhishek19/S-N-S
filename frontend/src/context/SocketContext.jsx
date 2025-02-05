import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";
import { conversationsAtom } from "../atoms/messagesAtom";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useRecoilValue(userAtom);
  const setConversations = useSetRecoilState(conversationsAtom);

  useEffect(() => {
    if (!user?._id) return; // Connect only if user is authenticated

    const newSocket = io("http://localhost:5000", {
      query: { userId: user._id },
    });

    setSocket(newSocket);

    // Listen for online users
    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("project-message", (newMessage) => {
      console.log("Received project - message:", newMessage);

      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map(conversation => {
          if (conversation._id === newMessage.conversationId) {
            return {
              ...conversation,
              messages: [...(conversation.messages || []), newMessage],
              lastMessage: {
                text: newMessage.text,
                sender: newMessage.sender,
              },
            };
          }
          return conversation;
        });

        // Add new conversation if it doesn't exist
        const conversationExists = updatedConversations.some(
          (conv) => conv._id === newMessage.conversationId
        );
        if (!conversationExists) {
          updatedConversations.push({
            _id: newMessage.conversationId,
            participants: [
              {
                _id: newMessage.sender,
                username: newMessage.sender === "ai" ? "AI" : "User",
              },
            ],
            messages: [newMessage],
            lastMessage: {
              text: newMessage.text,
              sender: newMessage.sender,
            },
          });
        }

        return updatedConversations;
      });
    });

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, [user?._id, setConversations]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};