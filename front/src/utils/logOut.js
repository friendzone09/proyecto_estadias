const API_URL = import.meta.env.VITE_API_URL

export async function logOut(navigate) {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    console.log('Usuario deslogueado');

    window.location.href = '/';
}
