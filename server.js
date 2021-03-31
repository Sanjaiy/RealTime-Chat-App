const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  findUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "SK Bot";
// Run when a client coonects //
io.on("connection", (socket) => {
  //socket.emit() => for the single user
  //socket.broadcast.emit() => for every users except the user
  //io.emit() => for every users

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome user
    socket.emit("message", formatMessage(botName, "Welcome to SK ChatApp"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `A ${user.username} has joined the chat`)
      );

    //Emit users and room
    io.to(user.room).emit("userAndRoom", {
      room: room,
      users: getRoomUsers(room),
    });
  });

  //Emit Message to server
  socket.on("chatMessage", (msg) => {
    const user = findUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Runs when the client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `A ${user.username} has left the chat`)
      );
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log("Server Running..."));
