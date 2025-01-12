import React, { useEffect } from "react";
import io from "socket.io-client";

const WebSocketComponent = () => {
  useEffect(() => {
    // Define WebSocket URL with fallback to localhost
    const wsUrl =
      process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:5001";
    const socket = io(wsUrl);

    socket.on("test_message", (data) => {
      console.log("Test message received:", data);
    });

    socket.on("message", (data) => {
      console.log("Received data:", data);
      displayPopupNotification(data);
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to handle and display popup notifications
  const displayPopupNotification = (data) => {
    if (window.location.href === "http://localhost:3003/device") {
      if (data && data.notification && data.content) {
        console.log("Received notification:", data);
        alert(data.notification + "\n" + data.content);
      } else {
        console.warn("Invalid notification data received:", data);
      }
    }
  };

  return null;
};

export default WebSocketComponent;
