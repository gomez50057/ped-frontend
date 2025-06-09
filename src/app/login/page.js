'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './login.module.css';
const imgBasePath = "/img/login/";


export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      console.log('Haciendo POST a:', '/api/login/');
      await axios.post('/api/login/', { username: user, password: pass }, { withCredentials: true });
      router.replace('/dashboard');
    } catch (e) {
      setErr(e.response?.data?.detail || e.message);
    }
  };

  return (
    <section>
      <form onSubmit={submit} className={styles.login}>

        <div className={styles.containerInicioSeccion}>
          <div className={styles.imgInicio}>
            <img src={`${imgBasePath}inicio de seccion.png`} alt="inicio de seccion" />
          </div>
          <div className={styles.inputGroup}>
          <input
            id="username"
            className={styles.input}
            type="text"
            placeholder=" "        /* <- un espacio para habilitar :placeholder-shown */
            value={user}
            onChange={e => setUser(e.target.value)}
            required
          />
          <label htmlFor="username">Usuario</label>
        </div>

        {/* Grupo Contraseña */}
        <div className={styles.inputGroup}>
          <input
            id="password"
            className={styles.input}
            type="password"
            placeholder=" "
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
          />
          <label htmlFor="password">Contraseña</label>
        </div>

          {err && <p className={styles.error}>{err}</p>}
          <button type="submit" className={styles.button}>
            Entrar
          </button>

        </div>

        <div className={styles.containerLoginImg}>
          <div className={styles.imgLogin}>
            <img src={`${imgBasePath}imgLogin.png`} alt="Login" />
          </div>
        </div>
      </form>
    </section>
  );
}
