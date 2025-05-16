export function getUser(){
    const userData = localStorage.getItem('psycho_user')

    if (!userData) return null;

    const user = JSON.parse(userData)

    return user.type
}