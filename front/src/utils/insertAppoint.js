export async function insertAppoint(formData){
    const response = await fetch('http://127.0.0.1:5000/insert_appoint',{
        method : 'POST',
        body: formData
    });

    const data = await response.json()

    if(!response.ok){
        return {'message' : 'Error'}, 401
    }

    return data
}