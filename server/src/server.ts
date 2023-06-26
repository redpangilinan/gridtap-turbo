import express from 'express';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import scoresRouter from './routes/scores';

config();
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Home');
});

// Rate limit middleware
const limiter = rateLimit({
  windowMs: 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
});

// CORS configuration
if (process.env.NODE_ENV === 'production') {
  const allowedOrigins = [process.env.DOMAIN];

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.status(403).send('Forbidden access');
      return;
    }
    next();
  });
}

// Routes
app.use('/users', limiter, usersRouter);
app.use('/auth', limiter, authRouter);
app.use('/scores', limiter, scoresRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
