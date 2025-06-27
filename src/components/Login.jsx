import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import style from '../css/Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 👈 for navigation

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login clicked");
    console.log("Username:", username);
    console.log("Password:", password);

    // You can add real authentication here
    navigate('/dashboard'); // 👈 go to dashboard
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
