import dotenv from 'dotenv';
dotenv.config();

const fetchToken = async () => {
  const base64Encode = (login, password) => {
    return Buffer.from(`${login}:${password}`).toString('base64');
  };
  const authHeader = `Basic ${base64Encode(
    process.env.LOGIN,
    process.env.PASSWORD
  )}`;
  const response = await fetch('https://01.kood.tech/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch token: ${response.statusText}`);
  }
  return await response.json();
};

export default fetchToken;
