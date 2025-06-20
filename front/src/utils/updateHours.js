export async function updateHours(formdata){
    
    const response = await fetch('http://localhost:5000/api/update_hours', {
        method : 'PUT',
        body : formdata,
        credentials: 'include'
    });

    const data = await response.json()
    return data;

}