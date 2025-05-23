export async function updateHours(formdata){
    
    const response = await fetch('http://127.0.0.1:5000/update_hours', {
        method : 'PUT',
        body : formdata
    });

    const data = await response.json()
    return data;

}