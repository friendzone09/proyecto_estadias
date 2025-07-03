const API_URL = import.meta.env.VITE_API_URL

export async function insertAppoint(formData){
    const response = await fetch(`${API_URL}/insert_appoint`,{
        method : 'POST',
        body: formData,
        credentials : 'include'
    });

    const data = await response.json()

    return data
}