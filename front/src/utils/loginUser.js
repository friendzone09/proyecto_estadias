const API_URL = import.meta.env.VITE_API_URL

export async function login({ email, password }) {
    const response = await fetch(`${API_URL}/login`, {
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