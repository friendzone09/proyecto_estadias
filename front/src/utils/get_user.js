export async function getUser() {
    const response = await fetch('http://localhost:5000/api/get_all_user_info',{
        credentials : 'include'
    });

    const data = await response.json();

    console.log(data)

    return data.user;
}

export async function getAllPsychos() {
    const response = await fetch('http://localhost:5000/api/psychos', {
        method : 'GET',
    });

    const data = await response.json()

    return data
}

export async function getPsychoInfo(psychoId) {
    const response = await fetch(`http://localhost:5000/api/get_psycho_info/${psychoId}`, {
        method: 'GET',
    });

    const data = await response.json();

    return data;
}

export async function getMyPsychoInfo() {
    const response = await fetch('http://localhost:5000/api/get_all_user_info',{
        credentials : 'include'
    });

    const data = await response.json();

    return data.user;
}