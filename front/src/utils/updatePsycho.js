export async function updatePsycho(formData) {
    const response = await fetch('http://localhost:5000/api/update_psycho_profile',{
        method : 'PUT',
        body: formData,
        credentials: 'include'
    });

    const data = await response.json()

    return data
}