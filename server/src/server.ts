import express from 'express';
import rateLimit from 'express-rate-limit';
import usersRouter from './routes/users';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Home');
});

// Rate limit middleware
const limiter = rateLimit({
  windowMs: 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
});

// Routes
app.use('/users', limiter, usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
