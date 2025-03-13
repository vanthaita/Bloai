"use client";
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    console.log('Register data:', formData);
  };

  return (
    <div className={styles['register-container']}>
      <div className={styles['register-form']}>
        <h2 className="text-3xl font-bold text-center mb-8">Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <input
              type="text"
              name="username"
              placeholder="Tên người dùng"
              value={formData.username}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
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
          <div className={styles['form-group']}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles['submit-btn']}>Đăng ký</button>
        </form>
        <p className={styles['switch-form']}>
          Đã có tài khoản? <Link href="/auth/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 