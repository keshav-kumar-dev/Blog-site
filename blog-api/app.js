const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const express = require('express');
const { jwtStrategy } = require('./config/passport');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const http = require('http');

require('dotenv').config();
const db = require('./config/db');
const authRouter = require('./routes/authRoutes');
const blogRouter = require('./routes/blogRoutes');
const { initSocket } = require('./services/socket');

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(
  cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(passport.initialize()); // Passport initialization
passport.use('jwt', jwtStrategy);

app.use(express.json());
app.use(cookieParser());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth/', authRouter);
app.use('/api/blogs/', blogRouter);

async function startServer() {
  try {
    await db();
    console.log('Database connected');

    server.listen(process.env.PORT, () => {
      console.log('Server running on port', process.env.PORT);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1); // Crash intentionally (fail fast)
  }
}

startServer();

module.exports = { server };
