import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import style from '../css/Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred');
  }
};


  return (
    <div className={style.loginContainer}>
      <img src={logo} alt="logo" className={style.logo} />

      <form onSubmit={handleLogin} className={style.form}>
        <input
          type="text"
          placeholder="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={style.input}
        />

        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={style.input}
        />

        <button type="submit" className={style.button}>
          LOGIN
        </button>
      </form>
    </div>
  );
}

export default Login;
