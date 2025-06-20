export async function fetchWithAuth(url, options = {}) {
  const baseOptions = {
    ...options,
    credentials: 'include' 
  };

  let response = await fetch(url, baseOptions);

  // Si el token expiró, se intenta renovar
  if (response.status === 401) {
    console.warn('Access token expirado, intentando renovar...');

    const refreshResponse = await fetch('http://localhost:5000/api/refresh_token', {
      credentials: 'include'
    });

    if (refreshResponse.ok) {
      // Reintenta la petición original
      response = await fetch(url, baseOptions);
    } else {
      return refreshResponse;
    }
  }

  return response;
}