// utils/auth.js
export async function fetchWithAuth(url, options = {}) {
  const access = localStorage.getItem('access');
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    }
  });

  // Si expira el access token, intenta refrescar
  if (response.status === 401) {
    const refresh = localStorage.getItem('refresh');
    const res = await fetch('/api/auth/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('access', data.access);
      // Reintenta la petición original con el nuevo access
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${data.access}`,
          'Content-Type': 'application/json',
        }
      });
    } else {
      // No se pudo refrescar, fuerza logout
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }
  }
  return response;
}
