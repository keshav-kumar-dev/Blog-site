const { Server } = require('socket.io');

let io;

const initSocket = async (server) => {
  console.log('soc');
  io = new Server(server, {
    cors: {
      origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('connected', 'socket connected');
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };
