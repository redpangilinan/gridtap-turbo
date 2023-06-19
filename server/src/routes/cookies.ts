import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

config();
const app = express.Router();

// Middleware
app.use(cors({ origin: [process.env.DOMAIN], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ===== CRUD =====
app.get('/', async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const responseObj = {
        token: token,
        decoded: decoded,
      };
      res.status(200).json(responseObj);
    } catch (error) {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

app.delete('/delete', async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.sendStatus(200);
});

export default app;
