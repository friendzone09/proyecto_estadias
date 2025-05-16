export async function getSchedule(formData) {
    const response = await fetch('http://127.0.0.1:5000/get_schedule',{
        method : 'POST',
        body: formData
    });

    const data = await response.json()

    if(!response.ok){
        return {'message' : 'Error w'}, 401
    }

    return data
}