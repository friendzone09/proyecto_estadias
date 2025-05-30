export async function updatePsycho(formData) {
    const response = await fetch('http://127.0.0.1:5000/api/update_psycho_profile',{
        method : 'PUT',
        body: formData
    });

    const data = await response.json()

    return data
}