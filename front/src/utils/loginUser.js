export async function login({ email, password }) {
    const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const resData = await response.json();
    return resData;
}

export async function reLoginUser(user) {
    localStorage.removeItem('psycho_user')

    localStorage.setItem('psycho_user', JSON.stringify(user))
}