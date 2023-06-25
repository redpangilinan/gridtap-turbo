import axios from 'axios';

type Inputs = {
  username: string;
  email: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

type ScoreProps = {
  score: number;
  accuracy: number;
  maxCombo: number;
  hits: number;
  miss: number;
  device: string;
};

type TokenProps = {
  accessToken: string;
  decoded: {
    userId: number;
  };
};

// Get all the users
export const getUsers = (page: number) => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users?page=${page}&limit=25`;
  return axios.get(apiUrl).then((res) => res.data);
};

// Get the user data by username
export const getUserByUsername = (username: string) => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users/${username}`;
  return axios.get(apiUrl).then((res) => res.data);
};

// Get the user data to display for settings
export const getUserSettings = (id: number) => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users/settings/${id}`;
  return axios.get(apiUrl).then((res) => res.data);
};

// Get user statistics to be shown in homepage
export const getUserCount = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users/stats`;
  return axios.get(apiUrl).then((res) => res.data);
};

// Get user data from access token
export const getUserTokens = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/auth`;
  return axios.get(apiUrl, { withCredentials: true }).then((res) => res.data);
};

// Refresh access token
export const refreshUserTokens = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/auth/refresh`;
  return axios.get(apiUrl, { withCredentials: true });
};

// Update account information
export const updateUserInfo = (
  data: Inputs,
  token: TokenProps,
  section = 'info'
) => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users/${section}/${
    token.decoded.userId
  }`;
  return axios
    .put(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    })
    .then((res) => res.data);
};

// Score submission
export const submitScore = async (data: ScoreProps, token: TokenProps) => {
  const userId = token.decoded.userId;
  const jwtToken = token.accessToken;
  const postData = { ...data, userId };
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/scores`;
  await axios.post(apiUrl, postData, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
};
