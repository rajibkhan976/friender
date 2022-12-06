const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "null",
        "*"
      ],
      methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
      allowedHeaders: ["my-custom-header"],
      transports: ['websocket', 'polling'],
      credentials: true
    },
    allowEIO3: true
});


io.on('connect', (socket) => {

  // request emited to extension site
  socket.on('testMsg', (message) => {
    // console.log("message", message);
    io.emit("friendlistcount", message)
  });


  socket.on('disconnect', () => {
   
  })
});

app.use(cors());
server.listen(5000, () => console.log(`Server has started.`));