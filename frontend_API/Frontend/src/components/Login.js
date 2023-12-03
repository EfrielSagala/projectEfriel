// import React from 'react'

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css'


const login = async (username, password) => {
  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      // Login berhasil
      const data = await response.json();
      const token = data.token;
      // Simpan token di local storage
      localStorage.setItem("token", token);
    } else {
      // Login gagal
      alert("Username atau password salah");
    }

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
  
      if (response.ok) {
        // Login berhasil
        navigate("/v1/book");
      } else {
        // Login gagal
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <div className="login-container">
        <h2 className='text-center'>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button onClick={handleLogin} className=" bg-danger login-button">
          Login
        </button>
        {state && state.error && (
          <p className='text-center mt-4' style={{ color: "red" }}>{state.error}</p>
        )}
      </div>
    </div>
  );
};
  

export default Login