"use client";
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login data:', formData);
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-form']}>
        <h2 className="text-3xl font-bold text-center mb-8">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles['form-group']}>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles['submit-btn']}>Đăng nhập</button>
        </form>
        <p className={styles['switch-form']}>
          Chưa có tài khoản? <Link href="/auth/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;