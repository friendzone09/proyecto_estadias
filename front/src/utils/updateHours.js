const API_URL = import.meta.env.VITE_API_URL

export async function updateHours(formdata){
    const response = await fetch(`${API_URL}/update_hours`, {
        method : 'PUT',
        body : formdata,
        credentials: 'include'
    });

    const data = await response.json()
    return data;
}