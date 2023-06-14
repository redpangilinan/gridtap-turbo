import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();

// Validate JWT token
function validateToken(userType) {
  return function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Invalid token' });
        }
        if (userType !== 'any' && decoded.userType !== userType) {
          return res.status(403).json({ error: 'Access forbidden' });
        }
        req.user = decoded;
        next();
      });
    } else {
      res.status(401).json({ error: 'Token not provided' });
    }
  };
}

export default validateToken;
