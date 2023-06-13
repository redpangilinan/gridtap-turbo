import express from 'express';
import usersRouter from './routes/users';
import { validateApiKey } from './middleware/validateApi';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Home');
});

// Routes
app.use('/users', validateApiKey, usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
