import axios from 'axios';

type ScoreProps = {
  score: number;
  accuracy: number;
  maxCombo: number;
  hits: number;
  miss: number;
  device: string;
};

// Get all the users
export const getUsers = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users`;
  return axios.get(apiUrl).then((res) => res.data);
};

// Get user data from JWT token
export const tokenData = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/cookies`;
  return axios.get(apiUrl, { withCredentials: true }).then((res) => res.data);
};

// Score submission
export const submitScore = async (data: ScoreProps) => {
  const token = await tokenData();
  const userId = token.decoded.userId;
  const jwtToken = token.token;
  const postData = { ...data, userId };
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/scores`;
  await axios.post(apiUrl, postData, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
};
