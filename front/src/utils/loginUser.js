export async function login(formData) {

    let succes = true;
            
    const response = await fetch('http://127.0.0.1:5000/api/login',{
        method : 'POST',
        body : formData
    });

    const data = await response.json();

    if (!response.ok){
        succes = false;
    } 
            
    if(succes){
        localStorage.setItem('psycho_user', JSON.stringify(data.user))
    } 

    return data

}

export async function reLoginUser(user) {
    localStorage.removeItem('psycho_user')

    localStorage.setItem('psycho_user', JSON.stringify(user))
}