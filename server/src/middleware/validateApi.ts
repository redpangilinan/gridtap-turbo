import { config } from 'dotenv';
config();

// Validate API Access Key
function validateApiKey(req, res, next) {
  const providedApiKey = req.query.api_key;

  if (providedApiKey && isValidApiKey(providedApiKey)) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid API Access Key.' });
  }
}

// Function to validate the API Access Key
function isValidApiKey(apiKey) {
  const validKeys = [process.env.DEVELOPER_KEY];
  return validKeys.includes(apiKey);
}

export { validateApiKey };
