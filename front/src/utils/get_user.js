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