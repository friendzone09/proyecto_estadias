export async function activateAppoint(formData){
    const response = await fetch('http://127.0.0.1:5000/activate_appoint',{
        method : 'POST',
        body: formData
    });

    const data = await response.json()

    if(!response.ok){
        console.error( 'ERROR: ', data.message)
        return {'message' : data.message}, 401
    }

    return data
}