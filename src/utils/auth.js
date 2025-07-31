// // utils/auth.js
// async function logout() {
//   localStorage.removeItem('access');
//   localStorage.removeItem('refresh');
//   window.location.href = '/login';
//   throw new Error('Sesión expirada');
// }

// export async function fetchWithAuth(url, options = {}) {
//   // Construye headers base
//   const access = localStorage.getItem('access');
//   const headers = {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   };
//   if (access) {
//     headers['Authorization'] = `Bearer ${access}`;
//   }

//   let response;
//   try {
//     response = await fetch(url, { ...options, headers });
//   } catch (networkError) {
//     console.error('[fetchWithAuth] Error de red:', networkError);
//     throw networkError;
//   }

//   // Si recibimos 401 o 400 con fallo de token, intentamos refresh
//   if (response.status === 401 || response.status === 400) {
//     let body;
//     try {
//       // Clonamos para no "consumir" el body original
//       body = await response.clone().json();
//     } catch (e) {
//       // No es JSON, puede que no sea por token
//     }

//     const isTokenError =
//       response.status === 401 ||
//       (response.status === 400 && body?.detail?.toLowerCase().includes('token'));

//     if (isTokenError) {
//       const refresh = localStorage.getItem('refresh');
//       if (!refresh) {
//         return logout();
//       }

//       const refreshRes = await fetch('/api/auth/refresh/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refresh }),
//       });

//       if (!refreshRes.ok) {
//         return logout();
//       }

//       const { access: newAccess } = await refreshRes.json();
//       localStorage.setItem('access', newAccess);

//       // Reintenta la petición original con el nuevo token
//       headers['Authorization'] = `Bearer ${newAccess}`;
//       response = await fetch(url, { ...options, headers });
//     }
//   }

//   return response;
// }

// utils/auth.js
let isRefreshing = false;
const refreshSubscribers = [];

// Cuando el refresh termine, notifica a todos los que estaban esperando
function onRefreshed(newAccess) {
  refreshSubscribers.forEach(cb => cb(newAccess));
  refreshSubscribers.length = 0;
}

// Encola callbacks que se ejecutarán tras el refresh
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

export function logout() {
  localStorage.removeItem('access');
  // Si guardas refresh en localStorage:
  localStorage.removeItem('refresh');
  // Si lo guardas en cookie HttpOnly, simplemente redirige sin tocar cookie:
  window.location.href = '/login';
  throw new Error('Sesión expirada');
}

export async function fetchWithAuth(input, init = {}, retryCount = 0) {
  //— 0) Detecta offline —
  if (typeof window !== 'undefined' && !navigator.onLine) {
    throw new Error('Offline: sin conexión de red');
  }

  //— 1) Prepara timeout y headers —
  const controller = new AbortController();
  const timeout = init.timeout || 10000; // 10s por defecto
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  const access = localStorage.getItem('access');
  if (access) headers.set('Authorization', `Bearer ${access}`);

  try {
    //— 2) Ejecuta la petición —
    let response = await fetch(input, {
      ...init,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    //— 3) Si expira token, maneja refresh —
    if (response.status === 401) {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) return logout();

      // Si ya estamos refrescando, guarda la petición
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(async newAccess => {
            try {
              headers.set('Authorization', `Bearer ${newAccess}`);
              const retryRes = await fetch(input, { ...init, headers });
              resolve(retryRes);
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      // Inicia refresh
      isRefreshing = true;
      try {
        const r = await fetch('/api/auth/refresh/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh })
        });
        if (!r.ok) throw new Error('Refresh fallido');
        const { access: newAccess } = await r.json();
        localStorage.setItem('access', newAccess);
        isRefreshing = false;
        onRefreshed(newAccess);

        // Reintenta la petición original
        headers.set('Authorization', `Bearer ${newAccess}`);
        response = await fetch(input, { ...init, headers });
      } catch (err) {
        isRefreshing = false;
        return logout();
      }
    }

    //— 4) Si status >=500 ó 408, aplica retry exponencial —
    if (!response.ok && (response.status >= 500 || response.status === 408) && retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      await new Promise(res => setTimeout(res, delay));
      return fetchWithAuth(input, init, retryCount + 1);
    }

    //— 5) Si abort (timeout) o network error, también reintenta —
    if (response.type === 'opaqueredirect' && retryCount < 3) {
      // este caso rara vez pasa, pero por deferir de network:
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(res => setTimeout(res, delay));
      return fetchWithAuth(input, init, retryCount + 1);
    }

    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    // AbortController abortó → retry
    if ((err.name === 'AbortError' || err instanceof TypeError) && retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(res => setTimeout(res, delay));
      return fetchWithAuth(input, init, retryCount + 1);
    }
    console.error('[fetchWithAuth] Error fatal:', err);
    throw err;
  }
}
