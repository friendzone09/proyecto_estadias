export async function updatePsycho(formData, id) {
    const response = await fetch('http://127.0.0.1:5000/update_psycho_profile',{
        method : 'POST',
        body: formData
    });

    const data = await response.json()

    await reLoginPsycho(id);

    return data
}

async function reLoginPsycho(id){

    localStorage.removeItem('psycho_user')

    const formData = new FormData()
    formData.append('id' , id)

    const response = await fetch('http://127.0.0.1:5000/relogin_psycho', {
        method : 'POST',
        body: formData
    });

    const data = await response.json();

    localStorage.setItem('psycho_user', JSON.stringify(data.user))

}