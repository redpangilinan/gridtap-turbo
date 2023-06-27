import express, { Request, Response } from 'express';
import cors from 'cors';
import { pool } from '../db';
import bcrypt from 'bcrypt';
import validateToken from '../middleware/validateToken';
import validateId from '../middleware/validateId';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

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

    let query = `INSERT INTO tb_users (username, password, user_type`;

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

app.get('/', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const limit = parseInt(req.query.limit as string) || 10;
    let page = parseInt(req.query.page as string) || 1;

    const countQuery = `
      SELECT COUNT(*) as total_count
      FROM tb_users
      WHERE user_status = 'active'
    `;

    const countResult = await client.query(countQuery);
    const totalCount = parseInt(countResult.rows[0].total_count);
    const totalPages = Math.ceil(totalCount / limit);

    if (page < 1) {
      page = 1;
    }

    if (page > totalPages) {
      page = totalPages;
    }

    const offset = (page - 1) * limit;

    const query = `
      WITH user_scores AS (
        SELECT user_id, SUM(score) AS total_score, MAX(score) AS top_score
        FROM tb_scores
        GROUP BY user_id
      )
      SELECT 
        u.user_id,
        u.username,
        u.scores,
        u.user_type,
        COALESCE(s.top_score, 0) AS top_score,
        COALESCE(((s.top_score * u.scores) / (5000 + (s.top_score + u.scores))), 0) + 1 AS level,
        TRUNC(((COALESCE(((s.top_score::numeric * u.scores) / (5000 + (s.top_score + u.scores))), 0) + 1) - (COALESCE(((s.top_score * u.scores) / (5000 + (s.top_score + u.scores))), 0) + 1)) * 100::numeric, 2) AS exp_percent,
        s.total_score,
        RANK() OVER (ORDER BY COALESCE(s.total_score, -999999) DESC, u.created_at ASC) AS user_rank
      FROM tb_users u
      LEFT JOIN user_scores s ON u.user_id = s.user_id
      WHERE u.user_status = 'active'
      ORDER BY user_rank ASC
      LIMIT ${limit}
      OFFSET ${offset}`;

    const result = await client.query(query);

    client.release();

    res.json({
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
      },
    });
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Fetch user data by ID to display for settings
app.get('/settings/:userId', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const { userId } = req.params;
    const values = [userId];

    let query = `SELECT username, email FROM tb_users WHERE user_id = $1 AND user_status = 'active'`;
    const result = await client.query(query, values);

    client.release();
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user', err);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update user info by ID
app.put(
  '/:section/:userId',
  validateToken('any'),
  validateId,
  async (req: Request, res: Response) => {
    try {
      const client = await pool.connect();

      const { section, userId } = req.params;
      const { username, email, oldPassword, password } = req.body;

      let query = `UPDATE tb_users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *`;
      let values = [username, email, userId];
      if (section === 'password') {
        // Fetch the user's current password
        const fetchQuery = `SELECT password FROM tb_users WHERE user_id = $1`;
        const fetchResult = await pool.query(fetchQuery, [userId]);

        if (fetchResult.rows.length === 0) {
          client.release();
          return res.status(404).json({ error: 'User not found' });
        }

        const storedPassword = fetchResult.rows[0].password;
        const passwordMatch = await bcrypt.compare(oldPassword, storedPassword);

        if (!passwordMatch) {
          client.release();
          return res.status(500).json({ error: 'Old password does not match' });
        }

        // Update password if old password matches
        query = `UPDATE tb_users SET password = $1 WHERE user_id = $2 RETURNING *`;
        if (password.length < 6) {
          client.release();
          return res
            .status(500)
            .json({ error: 'Password should be at least 6 characters long' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        values = [hashedPassword, userId];
      }

      let result = await client.query(query, values);

      query = `SELECT * FROM tb_users WHERE user_id = $1 AND user_status = 'active'`;
      result = await client.query(query, [userId]);
      const user = result.rows[0];

      client.release();

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
          domain:
            process.env.NODE_ENV === 'production'
              ? process.env.COOKIE_DOMAIN
              : undefined,
        })
        .cookie('refreshToken', refreshToken, {
          sameSite: 'strict',
          path: '/',
          httpOnly: true,
          domain:
            process.env.NODE_ENV === 'production'
              ? process.env.COOKIE_DOMAIN
              : undefined,
        })
        .json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (err) {
      console.error('Error updating user', err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

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

app.get('/stats', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    let query = `
      SELECT COUNT(*) as total_count
      FROM tb_users
      WHERE user_status = 'active'`;
    const countResult = await client.query(query);

    query = `
      SELECT COUNT(*) AS online_users
      FROM tb_users
      WHERE updated_at >= NOW() - INTERVAL '15 minutes'
      AND user_status = 'active'`;
    const activeResult = await client.query(query);

    query = `
      SELECT MAX(score) AS top_score
      FROM tb_scores
      WHERE user_id
      NOT IN (SELECT user_id FROM tb_users WHERE user_status = 'restricted')`;
    const scoreResult = await client.query(query);

    const response = {
      user_count: countResult.rows[0],
      active_users: activeResult.rows[0],
      highest_score: scoreResult.rows[0],
    };

    client.release();

    res.json(response);
  } catch (err) {
    console.error('Error fetching stats', err);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

// Select user by username
app.get('/:username', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const { username } = req.params;
    const values = [username];

    let query = `
      SELECT 
        u.user_id,
        u.username,
        u.scores,
        u.user_type,
        u.created_at,
        u.updated_at,
        COALESCE(s.top_score, 0) AS top_score,
        COALESCE(((top_score * u.scores) / (5000 + (s.top_score + u.scores))), 0) + 1 AS level,
        TRUNC(((COALESCE(((top_score::numeric * u.scores) / (5000 + (s.top_score + u.scores))), 0) + 1) - (COALESCE(((top_score * u.scores) / (5000 + (s.top_score + u.scores))), 0) + 1))*100::numeric, 2) AS exp_percent
      FROM tb_users u
      LEFT JOIN (
        SELECT user_id, MAX(score) AS top_score
        FROM tb_scores
        GROUP BY user_id
      ) s ON u.user_id = s.user_id
      WHERE u.username = $1
      AND u.user_status = 'active'`;
    const userResult = await client.query(query, values);

    query = `
      SELECT tb_scores.score, tb_scores.hits, tb_scores.miss, tb_scores.accuracy, tb_scores.max_combo, tb_scores.device, tb_scores.submitted_at
      FROM tb_scores
      JOIN tb_users ON tb_scores.user_id = tb_users.user_id
      WHERE tb_users.username = $1
      ORDER BY tb_scores.score DESC`;
    const scoresResult = await client.query(query, values);

    query = `
    SELECT
      SUM(hits) AS total_hits,
      MAX(hits) AS highest_hits,
      ROUND(AVG(accuracy), 2) AS average_acc,
      SUM(score) AS total_score
    FROM tb_scores
    JOIN tb_users ON tb_scores.user_id = tb_users.user_id
    WHERE tb_users.username = $1`;
    const statsResult = await client.query(query, values);

    query = `
      SELECT user_rank
      FROM (
        SELECT user_id, username, RANK() OVER (ORDER BY COALESCE(total_score, -999999) DESC, created_at ASC) AS user_rank
        FROM (
          SELECT u.user_id, u.username, SUM(s.score) AS total_score, u.created_at
          FROM tb_users u
          LEFT JOIN tb_scores s ON u.user_id = s.user_id
          WHERE u.user_status != 'restricted'
          GROUP BY u.user_id, u.username, u.created_at
        ) AS user_scores
      ) AS ranked_users
      WHERE username = $1`;
    const rankResult = await client.query(query, values);

    const response = {
      user: userResult.rows[0],
      scores: scoresResult.rows,
      stats: statsResult.rows[0],
      rank: rankResult.rows[0],
    };

    client.release();
    res.json(response);
  } catch (err) {
    console.error('Error fetching user', err);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

export default app;
