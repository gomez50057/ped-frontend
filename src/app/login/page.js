'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './login.module.css';
const videoBasePath = '/video/';
const SEGUIMIENTO_GROUPS = [
  'SeguimientoActividadesAdmin',
  'SeguimientoActividadesEncargado',
  'SeguimientoActividadesSupervisor',
  'SeguimientoActividadesEmpleado',
];

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('groups');
    document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax';
    document.cookie = 'refresh_token=; Path=/; Max-Age=0; SameSite=Lax';
    delete axios.defaults.headers.common.Authorization;
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login/', {
        username: user,
        password: pass,
      });

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('groups', JSON.stringify(data.groups || []));
      const secureCookie = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `access_token=${data.access}; Path=/; Max-Age=3600; SameSite=Lax${secureCookie}`;
      document.cookie = `refresh_token=${data.refresh}; Path=/; Max-Age=604800; SameSite=Lax${secureCookie}`;
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

      const grupos = data.groups || [];

      if (grupos.some((group) => SEGUIMIENTO_GROUPS.includes(group))) {
        router.replace('/seguimiento-actividades');
      } else if (grupos.includes('revision')) {
        router.replace('/revision');
      } else {
        router.replace('/dashboard');
      }
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.login}>
      <video
        className={styles.bgVideo}
        src={`${videoBasePath}bgLogin.mp4`}
        autoPlay
        muted
        loop
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.left}>
          <h1>
            <span className="spanDoarado">Hidalgo,</span>{' '}
            <span>Potencia</span> en <span>Marcha</span>
          </h1>
          <h2>El Futuro Comienza Contigo</h2>
          <p>
            Inicia sesión con tu usuario y contraseña para participar y ser parte
            del cambio. Construyamos juntos el futuro de Hidalgo.
          </p>
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
              autoComplete="username"
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
              autoComplete="current-password"
            />
            <label htmlFor="password">Contraseña</label>
          </div>
          {err && <p className={styles.error}>{err}</p>}

          <button type="submit" className={styles.learnMore} disabled={loading}>
            <span className={styles.circle} aria-hidden="true">
              <span className={`${styles.icon} ${styles.arrow}`}></span>
            </span>
            <span className={styles.buttonText}>
              {loading ? 'Entrando…' : 'Entrar'}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
