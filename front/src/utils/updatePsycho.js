const API_URL = import.meta.env.VITE_API_URL

export async function updatePsycho(formData) {
    const response = await fetch(`${API_URL}/update_psycho_profile`,{
        method : 'PUT',
        body: formData,
        credentials: 'include'
    });

    const data = await response.json()

    return data
}