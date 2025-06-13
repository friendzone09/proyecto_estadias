export async function logOut(navigate) {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    console.log('Usuario deslogueado');

    window.location.href = '/';
}
