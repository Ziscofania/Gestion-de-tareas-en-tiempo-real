const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const admin = require('firebase-admin');

// Inicializar Firebase
const serviceAccount = require('./firebase-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "TU_URL_DE_FIREBASE"
});
const db = admin.database();

const app = express();
app.use(cors());
const server = app.listen(4000, () => console.log('Server on port 4000'));

// Configurar Socket.io
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000", // URL de tu frontend
    methods: ["GET", "POST"]
  }
});

// Escuchar conexiones de sockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Escuchar eventos del frontend
  socket.on('addTask', (task) => {
    const ref = db.ref('tasks');
    ref.push(task); // Guardar en Firebase
    io.emit('taskAdded', task); // Notificar a todos
  });

  socket.on('deleteTask', (taskId) => {
    const ref = db.ref(`tasks/${taskId}`);
    ref.remove();
    io.emit('taskDeleted', taskId);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});