import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();

// Validate user ID
const validateId = (req, res, next) => {
  const userId = parseInt(req.params.userId) || req.body.userId;
  const accessToken = req.cookies.accessToken;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (userId === decoded.userId) {
        next();
      } else {
        res.status(401).json({ message: 'Unauthorized ID' });
      }
    } catch (error) {
      res.sendStatus(403).json({ message: 'Invalid token' });
    }
  } else {
    res.sendStatus(401).json({ message: 'No access token' });
  }
};

export default validateId;
