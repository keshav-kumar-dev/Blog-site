const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const express = require('express');
const { jwtStrategy } = require('./config/passport');
const passport = require('passport');

require('dotenv').config();
const db = require('./config/db');
const authRouter = require('./routes/authRoutes');
const blogRouter = require('./routes/blogRoutes');
const app = express();

app.use(passport.initialize()); // Passport initialization
passport.use('jwt', jwtStrategy);

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth/', authRouter);
app.use('/api/blogs/', blogRouter);

async function startServer() {
  try {
    await db();
    console.log('Database connected');

    app.listen(process.env.PORT, () => {
      console.log('Server running on port', process.env.PORT);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1); // Crash intentionally (fail fast)
  }
}

startServer();
