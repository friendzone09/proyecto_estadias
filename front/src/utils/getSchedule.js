export async function getSchedule(formData) {
    const response = await fetch('http://127.0.0.1:5000/get_appoint_for_patient',{
        method : 'POST',
        body: formData
    });

    const data = await response.json()

    if(!response.ok){
        return {'message' : 'Error'}, 401
    }

    console.log('SCHEDULE:', data.schedule);

    return data
}

export async function getHours(formData){
    const response = await fetch('http://127.0.0.1:5000/get_laboral_day', {
        method : 'POST',
        body: formData
    });

    const data = await response.json()

    if(!response.ok){
        return {'message' : 'Error'}, 401
    }

    return data;
}