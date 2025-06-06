export function getUser() {
    const userData = localStorage.getItem('psycho_user')

    if (!userData) return null;

    const user = JSON.parse(userData)

    return user
}

export async function getAllPsychos() {
    const response = await fetch('http://localhost:5000/api/psychos', {
        method : 'GET',
    });

    const data = await response.json()

    return data
}

export async function getPsychoInfo(psychoId) {
    const response = await fetch(`http://127.0.0.1:5000/api/get_psycho_info/${psychoId}`, {
        method: 'GET',
    });

    const data = await response.json();

    return data
}