export function getUserType(){
    const userData = localStorage.getItem('psycho_user')

    if (!userData) return null;

    const user = JSON.parse(userData)

    const userType = user.type;

    return userType
}

export function getUserPsycho(){
     const userData = localStorage.getItem('psycho_user')

    if (!userData) return null;

    const user = JSON.parse(userData)

    const userPsycho = user.psycho

    return userPsycho

}

export function getPatienId(){
    const userData = localStorage.getItem('psycho_user')

    if (!userData) return null;

    const user = JSON.parse(userData)

    return user.user_id;

}

export function getPsychoId(){
    const userData = localStorage.getItem('psycho_user')

    if (!userData) return null;

    const user = JSON.parse(userData)

    return user.user_id;
}

export function getPsycho(){
    const userData = localStorage.getItem('psycho_user')

    if (!userData) return null;

    const user = JSON.parse(userData)

    return user
}

export async function getPsychoInfo(){
    const userData = localStorage.getItem('psycho_user')

    if (!userData) return null;

    const user = JSON.parse(userData)

    const formData = new FormData()

    formData.append('id', user.user_id)

    const response = await fetch('http://127.0.0.1:5000/get_psychgo_info',{
        method : 'POST',
        body : formData,
    });

    const data = await response.json(); 

    return data
}