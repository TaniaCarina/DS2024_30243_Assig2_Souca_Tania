import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import { Nav, Navbar, NavbarBrand, Button, NavLink, Modal, ModalHeader, ModalBody, ModalFooter, Input,FormGroup} from "reactstrap";
import { TabContent, TabPane, NavItem } from "reactstrap";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import logo from "./commons/images/icon.png";
import { v4 as uuidv4 } from "uuid";

const textStyle = {
  color: "purple",
  textDecoration: "none",
};

const ChatMessage = ({ msg }) => {
  const userDataString = localStorage.getItem("authenticatedUser");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return (
    <div
      key={msg.id}
      style={{
        textAlign: msg.sender === userData.username ? "right" : "left",
        margin: "5px",
      }}
    >
      <span
        style={{
          backgroundColor:
            msg.sender === userData.username ? "#e0e0e0" : "#f0f0f0",
          borderRadius: "10px",
          padding: "10px 15px",
          display: "inline-block",
          maxWidth: "80%",
        }}
      >
        {msg.text}
      </span>
    </div>
  );
};

function NavigationBar() {
  const [modal, setModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const [activeChats, setActiveChats] = useState({ admin: { messages: [] } });
  const [selectedChat, setSelectedChat] = useState("admin");
  const userDataString = localStorage.getItem("authenticatedUser");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const isAdmin =
    userData && Array.isArray(userData.roles) && userData.roles[0] === "ADMIN";

  const modalRef = useRef(modal);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  function isUserAuthenticated() {
    const userData = localStorage.getItem("authenticatedUser");
    return userData !== null;
  }

  useEffect(() => {
    connect();
    scrollToBottom();
    return () => {
      disconnect();
    };
  }, [messages]);

  useEffect(() => {
    if (activeChats[selectedChat]) {
      scrollToBottom();
    }
  }, [activeChats, selectedChat]);

  useEffect(() => {
    modalRef.current = modal;
  }, [modal]);

  const toggleModal = () => {
    setModal(!modal);
    modalRef.current = !modal;
  };

  const connect = () => {
    const socket = new SockJS("http://localhost:8088/websocket-endpoint");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        if (
          receivedMessage.destination === userData.username ||
          receivedMessage.sender === userData.username
        ) {
          setActiveChats((prevChats) => {
            const updatedChats = { ...prevChats };
            const chatKey =
              receivedMessage.sender === userData.username
                ? receivedMessage.destination
                : receivedMessage.sender;

            if (!updatedChats[chatKey]) {
              updatedChats[chatKey] = { messages: [] };
            }

            if (
              !updatedChats[chatKey].messages.some(
                (msg) => msg.id === receivedMessage.id
              )
            ) {
              updatedChats[chatKey].messages.push(receivedMessage);
            }

            return updatedChats;
          });
        }
      });
    });

    setStompClient(client);
  };

  const disconnect = () => {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
    setStompClient(null);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "" && stompClient) {
      const newMessage = {
        id: uuidv4(),
        sender: userData.username,
        destination: isAdmin ? selectedChat : "admin",
        text: currentMessage,
        role: userData.roles[0],
      };
      stompClient.send("/app/send", {}, JSON.stringify(newMessage));
      setCurrentMessage("");
    }
  };

  const modalStyle = {
    maxWidth: "500px",
    height: "600px",
    overflow: "hidden",
  };
  return (
    <div>
      <Navbar color="purple" light expand="md">
        <NavbarBrand href="/">
          <img src={logo} width={"50"} height={"35"} />
        </NavbarBrand>
        <Nav className="mr-auto" navbar>
          <NavLink href="/user" style={textStyle}>
            Users
          </NavLink>
          <NavLink href="/device" style={textStyle}>
            Devices
          </NavLink>
        </Nav>

        <Nav className="ml-auto" navbar>
          {" "}
          {isUserAuthenticated() && (
            <Button
              style={{ marginRight: "10px", backgroundColor: "purple" }}
              onClick={toggleModal}
            >
              Chat
            </Button>
          )}
          <Button style={{ backgroundColor: "purple" }} href="/login">
            Login
          </Button>
          <Modal
            isOpen={modal}
            toggle={toggleModal}
            onOpened={connect}
            onClosed={disconnect}
            style={modalStyle}
          >
            <ModalHeader toggle={toggleModal}>Chat</ModalHeader>
            <ModalBody key={selectedChat}>
              <Nav tabs>
                {Object.keys(activeChats).map((user) => {
                  if (isAdmin && user === "admin") {
                    return null;
                  }
                  return (
                    <NavItem key={user}>
                      <NavLink
                        className={classnames({
                          active: selectedChat === user,
                        })}
                        onClick={() => {
                          console.log("Setting selected chat to user:", user);
                          setSelectedChat(user);
                        }}
                      >
                        Chat with {user}
                      </NavLink>
                    </NavItem>
                  );
                })}
              </Nav>

              <TabContent activeTab={selectedChat}>
                {Object.keys(activeChats).map((user) => (
                  <TabPane tabId={user} key={user}>
                    <div
                      className="chat-messages"
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        height: "600px",
                        paddingBottom: "10px",
                        paddingTop: "10px",
                      }}
                    >
                      {activeChats[user].messages.map((msg) => (
                        <ChatMessage key={msg.id} msg={msg} />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </TabPane>
                ))}
              </TabContent>
              <FormGroup>
                <Input
                  type="textarea"
                  placeholder="Type your message here..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleSendMessage}>
                Send
              </Button>{" "}
              <Button color="secondary" onClick={toggleModal}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
