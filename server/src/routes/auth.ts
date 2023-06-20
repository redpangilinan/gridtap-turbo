import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db';

config();
const app = express.Router();

// Middleware
app.use(cors({ origin: [process.env.DOMAIN], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Fetch token data
app.get('/', async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (accessToken && refreshToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const responseObj = {
        accessToken: accessToken,
        decoded: decoded,
      };
      res.status(200).json(responseObj);
    } catch (error) {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
});

// Refresh access token using refresh token
app.get('/refresh', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = jwt.sign(
            {
              userId: user.userId,
              username: user.username,
              userType: user.userType,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: '15m',
            }
          );
          res
            .status(200)
            .cookie('accessToken', accessToken, {
              sameSite: 'strict',
              path: '/',
              expires: new Date(new Date().getTime() + 60 * 60 * 1000),
              httpOnly: true,
            })
            .json();
        }
      );
    } catch (error) {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
});

// Login by creating new token cookies
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const client = await pool.connect();
    const query = `SELECT * FROM tb_users WHERE username = $1`;
    const result = await client.query(query, [username]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const accessToken = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        userType: user.user_type,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '15m',
      }
    );
    const refreshToken = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        userType: user.user_type,
      },
      process.env.REFRESH_TOKEN_SECRET
    );

    res
      .status(200)
      .cookie('accessToken', accessToken, {
        sameSite: 'strict',
        path: '/',
        expires: new Date(new Date().getTime() + 60 * 60 * 1000),
        httpOnly: true,
      })
      .cookie('refreshToken', refreshToken, {
        sameSite: 'strict',
        path: '/',
        httpOnly: true,
      })
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (err) {
    console.error('Error authenticating user', err);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// Logout by clearing token cookies
app.delete('/logout', async (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.sendStatus(200);
});

export default app;
