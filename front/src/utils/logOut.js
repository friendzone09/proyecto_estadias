export function logOut(){
    localStorage.removeItem('psycho_user');
    window.location.reload();
}