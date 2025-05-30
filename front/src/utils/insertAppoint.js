export async function insertAppoint(formData){
    const response = await fetch('http://127.0.0.1:5000/api/insert_appoint',{
        method : 'POST',
        body: formData
    });

    const data = await response.json()

    return data
}