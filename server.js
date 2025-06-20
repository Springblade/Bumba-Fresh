// server.js
const express = require('express');
const app     = express();
const http    = require('http');
const server  = http.createServer(app);
const io      = require('socket.io')(server);

app.use(express.static(__dirname));

const ADMIN_NAME = 'admin';

const users   = {};  // socket.id → username
const history = {};  // roomId    → [ { from, text, time } ]

function roomId(a, b) {
  return [a, b].sort().join('#');
}

io.on('connection', socket => {
  console.log(`🔌  New connection: ${socket.id}`);

  socket.on('new-user', name => {
    users[socket.id] = name;
    console.log(`✅  ${name} joined (${socket.id})`);
    // broadcast full list
    io.emit('user-list', Object.values(users));
  });

  socket.on('join-room', peer => {
    const me = users[socket.id];
    // Only allow admin ↔ someone OR someone ↔ admin
    if (me !== ADMIN_NAME && peer !== ADMIN_NAME) {
      console.warn(`🚫  ${me} tried to join room with ${peer}: forbidden`);
      return;
    }

    const room = roomId(me, peer);
    socket.join(room);
    // send the full chat history
    socket.emit('room-history', history[room] || []);
  });

  socket.on('send-private', ({ to, text }) => {
    const from = users[socket.id];
    // enforce the rule on the server
    if (from !== ADMIN_NAME && to !== ADMIN_NAME) {
      console.warn(`🚫  ${from} tried to message ${to}: forbidden`);
      return;
    }

    const room = roomId(from, to);
    const msg  = { from, text, time: new Date().toLocaleTimeString() };

    history[room] = history[room] || [];
    history[room].push(msg);

    // send to everyone in that private room
    io.to(room).emit('new-private-msg', msg);
  });

  socket.on('disconnect', () => {
    const name = users[socket.id];
    console.log(`❌  ${name} disconnected (${socket.id})`);
    delete users[socket.id];
    // broadcast updated list
    io.emit('user-list', Object.values(users));
  });
});

server.listen(3000, () =>
  console.log('🌐  Listening on http://localhost:3000')
);
