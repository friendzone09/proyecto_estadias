const API_URL = import.meta.env.VITE_API_URL

export async function getUser() {
    const response = await fetch(`${API_URL}/get_all_user_info`,{
        credentials : 'include'
    });

    const data = await response.json();
    return data.user;
}

export async function getAllPsychos() {
    const response = await fetch(`${API_URL}/psychos`, {
        method : 'GET',
    });

    const data = await response.json()
    return data
}

export async function getPsychoInfo(psychoId) {
    const response = await fetch(`${API_URL}/get_psycho_info/${psychoId}`, {
        method: 'GET',
    });

    const data = await response.json();
    return data;
}

export async function getMyPsychoInfo() {
    const response = await fetch(`${API_URL}/get_all_user_info`,{
        credentials : 'include'
    });

    const data = await response.json();
    return data.user;
}