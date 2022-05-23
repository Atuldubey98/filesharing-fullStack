module.exports = (io, socket) => {
  const loginHandler = async (payload) => {
    try {
      const { email, password } = payload;
      if (!email || !password) {
        io.to(socket.id).emit("private", "User not found");
        return;
      }
      const newUser = await User.findOneAndUpdate(
        { email },
        { socketId: socket.id, isLoggedIn: true }
      );
      io.to(socket.id).emit("private", "User logged in");
    } catch (e) {
      console.log(e);
    }
  };
  const privateHandler = async (data, email) => {
    try {
      const recipient = await User.findOne({ email });
      if (!recipient || recipient.socketId === socket.id) {
        io.to(socket.id).emit("private", "User not found");
        return;
      }
      if (!recipient.isLoggedIn) {
        io.to(socket.id).emit(
          "private",
          "Sending message failed user not logged in"
        );
      } else {
        io.to(recipient.socketId).emit("private", data);
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
  socket.on("disconnect", disconnectHandler);
  socket.on("private", privateHandler);
  socket.on("login", loginHandler);
};
