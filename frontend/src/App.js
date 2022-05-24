import React, { useEffect, useState } from "react";
import socket from "./socketSetup/socketSetup";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import { Routes, Route } from "react-router-dom";
function App() {
  const [socketId, setSocketId] = useState();
  const [payload, setPayload] = useState();
  const [connectedUser, setConnectedUser] = useState();
  const [sender, setSender] = useState();
  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("user connected " + socket.id);
    });
    socket.on("disconnect", () => {
      setSocketId();
      setPayload();
    });
    socket.on("private", (data) => {
      if (data.status) {
        setPayload(data);
      }
    });
    socket.on("connectSender", (data) => {
      if (data.status) {
        setConnectedUser(data.data);
      }
    });
    socket.on("loginUser", (data) => {
      setSender(data);
    });
    return () => {
      socket.removeAllListeners();
    };
  }, []);
  return (
    <div className="app">
      <Routes>
        <Route
          path="/login"
          element={<LoginPage socketId={socketId} payload={payload} />}
        />
        <Route
          path="/"
          element={
            <HomePage
              socketId={socketId}
              payload={payload}
              sender={sender}
              connectedUser={connectedUser}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
