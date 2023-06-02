import React, { useState, useEffect } from "react";
import checkPageStatus from "../utils/functions";
import axios from "axios";
import { database } from "../config/db";
import { ID, Permission, Role } from "appwrite";
import { REACT_APP_COLLECTION_ID, REACT_APP_DATABASE_ID } from "../utils/impdata";

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleTyping = () => {
    socket.emit("typing", {
      name: localStorage.getItem("userName"),
      socketID: socket.id,
    });
  };

  const handleKeyUp = () => {
    clearTimeout(typingTimeout); // Clear the previous timeout

    setTypingTimeout(
      setTimeout(() => {
        socket.emit("stoppedTyping", true);
      }, 1000)
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userName")) {
      const data = {
        text: message,
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        timestamp:new Date(Date.now()).toISOString(),
      };
      const res = await database.createDocument(
        REACT_APP_DATABASE_ID,
        REACT_APP_COLLECTION_ID,
        ID.unique(),
        data,
        [Permission.read(Role.any())]
      );
      // console.log(res);
      socket.emit("message", data);
      checkPageStatus(message, localStorage.getItem("userName"));
    }
    setMessage("");
  };

  useEffect(() => {
    return () => {
      // Clean up the timeout when the component unmounts
      clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          onKeyUp={handleKeyUp}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
