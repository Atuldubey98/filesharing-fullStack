import React, { useState } from "react";
import socket from "../../socketSetup/socketSetup";
import "./HomePage.css";
const HomePage = ({ payload, socketId, sender, connectedUser }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const onFilesChange = (e) => {
    setFiles(e.target.files);
  };
  const onMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const onMessageSubmit = (e) => {
    e.preventDefault();
    if (message.length !== 0) {
      socket.emit(
        "private",
        {
          message,
        },
        "test1"
      );
    } else {
      if (files.length !== 0) {
        console.log(files);
      }
    }
  };
  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (email.length === 0) {
      console.log("Cant submit");
      return;
    }
    socket.emit("connectSender", email);
  };
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  return (
    <div className="home__page">
      <div className="home__div">
        <div className="home__header">
          <form onSubmit={onSearchSubmit} className="home__headerForm">
            <div className="home__headerInput">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                placeholder="Receipient Email Id"
                className="input-text"
                type="text"
                value={email}
                onChange={onEmailChange}
              />
            </div>
            <button className="search-btn btn">Connect</button>
          </form>
        </div>
        <div className="home__body">
          <div className="home__userLoggedIn">
            <div className="sender__data">
              <span className="sender__heading">Name :</span>
              <span className="sender__data">{sender?.data?.name}</span>
            </div>
            <div className="sender__data">
              <span className="sender__heading">Socket ID :</span>
              <span className="sender__data">{socketId}</span>
            </div>
          </div>
          <form className="home__bodyForm" onSubmit={onMessageSubmit}>
            <div className="home__formInput">
              <i className="fa-solid fa-message"></i>
              <input
                type="text"
                className="input-text"
                placeholder={"Message"}
                value={message}
                onChange={onMessageChange}
              />
              <button className="btn" type="submit">
                Send
              </button>
            </div>

            <input type="file" onChange={onFilesChange} />
          </form>
          <div className="home__recipient">
            <div className="rec__data">
              <span className="rec__heading">Name :</span>
              <span className="rec__data">{connectedUser?.recipientName}</span>
            </div>
            <div className="rec__data">
              <span className="rec__heading">Socket Id :</span>
              <span className="rec__data">
                {connectedUser?.recipientSocketId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
