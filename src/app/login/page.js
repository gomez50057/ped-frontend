'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './login.module.css';
const videoBasePath = '/video/';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login/', {
        username: user,
        password: pass
      });

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      router.replace('/dashboard');
    } catch (e) {
      setErr(e.response?.data?.detail || 'Error al iniciar sesión');
    }
  };

  return (
    <section className={styles.login}>
      <video className={styles.bgVideo} src={`${videoBasePath}bgLogin.mp4`} autoPlay muted loop></video>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1><span className='spanDoarado'>Hidalgo,</span> <span>Potencia</span> en <span>Marcha</span></h1>
          <h2>El Futuro Comienza Contigo</h2>
          <p>Inicia sesión con tu usuario y contraseña para participar y ser parte del cambio. Construyamos juntos el futuro de Hidalgo.</p>
        </div>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              id="username"
              className={styles.input}
              type="text"
              placeholder=" "
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <label htmlFor="username">Usuario</label>
          </div>
          <div className={styles.inputGroup}>
            <input
              id="password"
              className={styles.input}
              type="password"
              placeholder=" "
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <label htmlFor="password">Contraseña</label>
          </div>
          {err && <p className={styles.error}>{err}</p>}
          <button type="submit" className={styles.learnMore}>
            <span className={styles.circle} aria-hidden="true">
              <span className={`${styles.icon} ${styles.arrow}`}></span>
            </span>
            <span className={styles.buttonText}>Entrar</span>
          </button>
        </form>
      </div>
    </section>
  );
}
