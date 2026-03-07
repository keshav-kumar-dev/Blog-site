const { Server } = require('socket.io');
const CustomError = require('../utils/CustomError');
const { status } = require('http-status');

let io;

const initSocket = async (server) => {
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
    throw new CustomError('Socket.io not initialized', status.BAD_REQUEST);
  }
  return io;
};

module.exports = { initSocket, getIO };
