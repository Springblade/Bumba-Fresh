// script.js
const socket   = io();
let me, current;

// in-memory chat histories
const history  = {};      // peer → [ msgs ]

const listEl   = document.getElementById('user-list');
const headerEl = document.getElementById('header');
const msgsEl   = document.getElementById('messages');
const form     = document.getElementById('input-form');
const input    = document.getElementById('msg-input');

// 1) prompt for your name
me = prompt('Your name?');
socket.emit('new-user', me);

// 2) Rebuild user sidebar on every update
socket.on('user-list', users => {
  listEl.innerHTML = '';
  // Admin sees everyone except themselves; normal users see only "admin"
  const targets = (me === 'admin')
    ? users.filter(u => u !== me)
    : users.filter(u => u === 'admin');

  targets.forEach(u => {
    const li = document.createElement('li');
    li.textContent = u;
    li.onclick = () => {
      current = u;
      headerEl.textContent = `Chat with ${u}`;
      msgsEl.innerHTML = '';
      (history[u] || []).forEach(m => append(m.from, m.text, m.time));
      socket.emit('join-room', u);
    };
    listEl.append(li);
  });
});

// 3) Load chat history when server responds
socket.on('room-history', h => {
  history[current] = h;
  msgsEl.innerHTML = '';
  h.forEach(m => append(m.from, m.text, m.time));
});

// 4) Append every incoming private message
socket.on('new-private-msg', msg => {
  history[current] = history[current] || [];
  history[current].push(msg);
  append(msg.from, msg.text, msg.time);
});

// 5) Sending a message
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!current) return alert('Select a chat partner first');
  const text = input.value.trim();
  if (!text) return;
  socket.emit('send-private', { to: current, text });
  input.value = '';
});

// helper to render one message
function append(from, text, time) {
  const d = document.createElement('div');
  d.innerHTML = `<strong>${from}</strong> <em>${time}</em><br>${text}`;
  msgsEl.append(d);
  msgsEl.scrollTop = msgsEl.scrollHeight;
}
