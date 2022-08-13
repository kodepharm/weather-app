import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const RegisterComponent = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', userData);
      router.replace('/account/profile');
    } catch (err) {
      console.log(err.response.data);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({...userData, [name]: value });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" onChange={e => handleChange(e)} />
      </label>
      <br />
      <label>
        Firstname:
        <input type="text" name="firstname" onChange={e => handleChange(e)} />
      </label>
      <br />
      <label>
        Lastname:
        <input type="text" name="lastname" onChange={e => handleChange(e)} />
      </label>
      <br />
      <label>
        Email:
        <input type="text" name="email" onChange={e => handleChange(e)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" onChange={e => handleChange(e)} />
      </label>
      <br />
      <button>Register</button>
    </form>
  )
}

export default RegisterComponent;