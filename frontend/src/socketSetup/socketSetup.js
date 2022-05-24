import { io } from "socket.io-client";

const socket = io("localhost:9000");

export default socket;
