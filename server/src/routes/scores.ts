import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { pool } from '../db';
import cookieParser from 'cookie-parser';
import validateToken from '../middleware/validateToken';
import validateId from '../middleware/validateId';

config();
const app = express.Router();

// Middleware
app.use(cors({ origin: [process.env.DOMAIN], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Submit scores
app.post(
  '/',
  validateToken('any'),
  validateId,
  async (req: Request, res: Response) => {
    try {
      const client = await pool.connect();

      const { score, accuracy, maxCombo, hits, miss, device, userId } =
        req.body;

      let query = `SELECT COUNT(*) AS score_count FROM tb_scores WHERE user_id = $1`;
      const countResult = await client.query(query, [userId]);
      const scoreCount = countResult.rows[0].score_count;

      if (score >= 2000) {
        query = `UPDATE tb_users SET user_status = 'restricted' WHERE user_id = $1`;
        await client.query(query, [userId]);
      }

      query = `SELECT user_status FROM tb_users WHERE user_id = $1`;
      const userStatus = await client.query(query, [userId]);
      if (userStatus.rows[0].user_status === 'restricted') {
        client.release();
        return res.status(403).json({ error: 'Restricted account.' });
      }

      query = `UPDATE tb_users SET scores = scores + 1 WHERE user_id = $1`;
      await client.query(query, [userId]);

      query = `
        INSERT INTO tb_scores (user_id, score, accuracy, max_combo, hits, miss, device)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
      const values = [userId, score, accuracy, maxCombo, hits, miss, device];
      const insertResult = await client.query(query, values);

      query = `SELECT score_id FROM tb_scores WHERE user_id = $1 ORDER BY score, submitted_at ASC LIMIT 1`;
      const lowestScoreResult = await client.query(query, [userId]);
      const lowestScoreId = lowestScoreResult.rows[0].score_id;

      if (scoreCount >= 10) {
        query = `DELETE FROM tb_scores WHERE user_id = $1 AND score_id = $2`;
        await client.query(query, [userId, lowestScoreId]);
      }

      client.release();
      res.json(insertResult.rows[0]);
    } catch (err) {
      console.error('Error submitting score', err);
      res.status(500).json({ error: 'Failed to submit score' });
    }
  }
);

export default app;
