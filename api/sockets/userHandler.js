module.exports = (io, socket) => {
  const loginHandler = async (payload) => {
    try {
      const { email, password } = payload;
      if (!email || !password) {
        io.to(socket.id).emit("loginUser", "User not found");
        return;
      }
      const newUser = await User.findOneAndUpdate(
        { email },
        { socketId: socket.id, isLoggedIn: true }
      );
      io.to(socket.id).emit("loginUser", {
        message: "User logged in",
        isLoggedIn: true,
        data: {
          email,
          name: newUser.name,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  const privateHandler = async (data, email) => {
    try {
      const recipient = await User.findOne({ email });
      if (!recipient || recipient.socketId === socket.id) {
        io.to(socket.id).emit("private", {
          status: false,
          message: "User not found",
        });
        return;
      }
      if (!recipient.isLoggedIn) {
        io.to(socket.id).emit(
          "private",
          "Sending message failed user not logged in"
        );
      } else {
        io.to(recipient.socketId).emit("private", {
          status: true,
          data,
        });
        io.to(socket.id).emit("private", {
          status: true,
          data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  const disconnectHandler = async () => {
    try {
      console.log("disconnect");
      const newUser = await User.findOneAndUpdate(
        { socketId: socket.id },
        { isLoggedIn: false, socketId: "" }
      );
      if (!newUser) {
        console.log("Not updated");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const connectSenderHandler = async (email) => {
    try {
      console.log(email);
      const recipient = await User.findOne({ email });
      if (!recipient || recipient.socketId === socket.id) {
        io.to(socket.id).emit("connectSender", {
          status: false,
          message: `User not found`,
        });
        return;
      }
      if (!recipient.isLoggedIn) {
        io.to(socket.id).emit("connectSender", {
          status: false,
          message: `Not logged in`,
        });
        return;
      }
      io.to(socket.id).emit("connectSender", {
        status: true,
        data: {
          recipientEmail: recipient.email,
          recipientIsLoggedIn: recipient.isLoggedIn,
          recipientSocketId: recipient.socketId,
          recipientName: recipient.name,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  socket.on("disconnect", disconnectHandler);
  socket.on("connectSender", connectSenderHandler);
  socket.on("private", privateHandler);
  socket.on("login", loginHandler);
};
