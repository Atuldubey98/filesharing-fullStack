const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const app = require("./app");
const port = process.env.PORT || 5000;
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const userHandler = require("./api/sockets/userHandler");
io.on("connection", (socket) => {
  console.log("Clients count on Server " + io.engine.clientsCount);
  console.log(socket.rooms);
  userHandler(io, socket);
});
io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

server.listen(port, () => {
  console.log("server is running on port " + port);
});
