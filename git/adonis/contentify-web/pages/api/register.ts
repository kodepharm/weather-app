import axios from 'axios';
import { setCookie } from 'nookies'

export default async (req, res) => {
  const { username, firstname, lastname, password, email } = req.body;

  try {
    const response = await axios.post('http://localhost:3333/register', {
      username,
      firstname,
      lastname,
      email,
      password,
    })

    setCookie({ res }, 'jwt', response.data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    res.status(200).end();
  } catch (e) {
    res.status(400).send(e.response.data.message[0].messages[0]);
  }
}