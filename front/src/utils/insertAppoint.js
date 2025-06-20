export async function insertAppoint(formData){
    const response = await fetch('http://localhost:5000/api/insert_appoint',{
        method : 'POST',
        body: formData,
        credentials : 'include'
    });

    const data = await response.json()

    return data
}