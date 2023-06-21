import express, { Request, Response } from 'express';
import cors from 'cors';
import { pool } from '../db';
import bcrypt from 'bcrypt';
import validateToken from '../middleware/validateToken';
import cookieParser from 'cookie-parser';

const app = express.Router();

// Middleware
app.use(cors({ origin: [process.env.DOMAIN], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ===== CRUD =====
app.post('/', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const { username, password, email, user_type } = req.body;

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password should be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let query = `
    INSERT INTO tb_users (username, password, user_type`;

    const values = [username, hashedPassword, user_type || 'user'];

    if (email) {
      query += `, email) VALUES ($1, $2, $3, $4) RETURNING *`;
      values.push(email);
    } else {
      query += `) VALUES ($1, $2, $3) RETURNING *`;
    }

    const result = await client.query(query, values);

    client.release();
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating a new user', err);
    res.status(500).json({ error: 'Failed to create a new user' });
  }
});

// Select all active users for leaderboards
app.get('/', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const query = `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.scores,
        u.user_type,
        COALESCE(s.top_score, 0) AS top_score,
        COALESCE(((top_score * u.scores) / 10000), 0) + 1 AS level,
        TRUNC(((COALESCE(((top_score::numeric * u.scores) / 10000), 0) + 1) - (COALESCE(((top_score * u.scores) / 10000), 0) + 1))*100::numeric, 2) AS exp_percent
      FROM tb_users u
      LEFT JOIN (
        SELECT user_id, MAX(score) AS top_score
        FROM tb_scores
        GROUP BY user_id
      ) s ON u.user_id = s.user_id
      WHERE u.user_status = 'active'
      ORDER BY top_score DESC, u.created_at`;

    const result = await client.query(query);

    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Select user by username
app.get('/:username', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const { username } = req.params;
    const query = `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.scores,
        u.user_type,
        u.created_at,
        COALESCE(s.top_score, 0) AS top_score,
        COALESCE(((top_score * u.scores) / 10000), 0) + 1 AS level,
        TRUNC(((COALESCE(((top_score::numeric * u.scores) / 10000), 0) + 1) - (COALESCE(((top_score * u.scores) / 10000), 0) + 1))*100::numeric, 2) AS exp_percent
      FROM tb_users u
      LEFT JOIN (
        SELECT user_id, MAX(score) AS top_score
        FROM tb_scores
        GROUP BY user_id
      ) s ON u.user_id = s.user_id
      WHERE u.username = $1`;
    const values = [username];
    const result = await client.query(query, values);

    client.release();
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user', err);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update user by ID
app.put('/:id', validateToken('any'), async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const { id } = req.params;
    const { username, password } = req.body;
    const query = `
      UPDATE tb_users
      SET username = $1, password = $2
      WHERE user_id = $3
      RETURNING *`;
    const values = [username, password, id];
    const result = await client.query(query, values);

    client.release();
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user by ID
app.delete(
  '/:id',
  validateToken('admin'),
  async (req: Request, res: Response) => {
    try {
      const client = await pool.connect();

      const { id } = req.params;
      const query = `DELETE FROM tb_users WHERE user_id = $1`;
      const values = [id];
      const result = await client.query(query, values);

      client.release();
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    } catch (err) {
      console.error('Error deleting user', err);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);

export default app;
