import React, { useState } from "react";
import "./LoginPage.css";
import instance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import socket from "../../socketSetup/socketSetup";
const LoginPage = ({ socketId, payload }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password === "" || email === "") {
      console.log("Error password or email");
      return;
    }
    try {
      socket.emit("login", {
        email,
        password,
      });
      const { data } = await instance.post("users/login", {
        email,
        password,
      });
      if (data.status) {
        setLoading(false);
        navigate("/", { replace: true });
      }
    } catch (e) {
      setError({ status: false });
      console.log(e);
      setLoading(false);
    }
  };
  return (
    <div className="login__page">
      <div className="login__div">
        <form onSubmit={onFormSubmit} className="login__form">
          <div className="login__formField">
            <i className="fa-solid fa-envelope"></i>
            <input
              value={email}
              onChange={onChangeEmail}
              className="input-text"
              name="email"
              type="text"
            />
          </div>
          <div className="login__formField">
            <i className="fa-solid fa-key"></i>
            <input
              value={password}
              onChange={onChangePassword}
              className="input-text"
              name="password"
              type="password"
            />
          </div>
          {!loading && (
            <div className="login__formBtn">
              <button type="submit" className="btn">
                Login
              </button>
            </div>
          )}
          {error && <div className="login__error">Some error occured</div>}
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
