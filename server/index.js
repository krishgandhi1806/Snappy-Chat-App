const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');
const userRoutes= require("./routes/userRoutes");
const messageRoute= require("./routes/messagesRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (!req.user) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
  }
  next();
});
require("dotenv").config();
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(con => {
  console.log("DB Connection successful");
}).catch((err) => {
  console.error(err);
});

const server = app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});

const io = socket(server, {
  cors: {
    // origin: 'http://localhost:3000' ,
    origin: "https://snappy-chat-app-sigma.vercel.app",
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

  socket.on("add-user", (userId) => {
    // console.log(`User added: ${userId}`);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    // console.log(`Message sent: ${data.msg}`);
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });

  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
    [...onlineUsers].find(([key, value]) => value === socket.id && onlineUsers.delete(key));
  });
});
