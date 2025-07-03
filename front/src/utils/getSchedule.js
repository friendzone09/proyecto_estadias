const API_URL = import.meta.env.VITE_API_URL

export async function getSchedule(id_psycho,date) {
    const response = await fetch(`${API_URL}/get_appoint_for_patient/${id_psycho}/${date}`,{
        method : 'GET',
    });

    const data = await response.json()

    if(!response.ok){
        return {'message' : 'Error'}, 401
    }

    return data
}

export async function getHours(psychoId, selectedDay){
    const response = await fetch(`${API_URL}/get_laboral_day/${psychoId}/${selectedDay}`, {
        method : 'GET',
    });

    const data = await response.json();
    return data;
}