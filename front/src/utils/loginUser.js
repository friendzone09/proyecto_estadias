export async function login(formData) {

    let succes = true;

     try{
            
            const response = await fetch('http://127.0.0.1:5000/login',{
                method : 'POST',
                body : formData
            });

            const data = await response.json();

            if (!response.ok){
                console.error('Error ', data.message);
                succes = false;
            } else{
                console.log(data.message)
                console.log(data.user)
            }   
            
            if(succes){
                localStorage.setItem('psycho_user', JSON.stringify(data.user))
                window.location.href = '/';
            } 

        }catch(e){
            console.error('ERROR AL INICIAR SESION: ', e)
            succes = false;
        }
}

export async function reLoginUser(PatienId) {
    const formData = new FormData();
    formData.append('id', PatienId);

    try{     
        const response = await fetch('http://127.0.0.1:5000/re_login',{
            method : 'POST',
            body : formData
        });

        const data = await response.json();

        if (!response.ok){
            console.error('Error ', data.message);
            succes = false;
        } else{
            localStorage.removeItem('psycho_user')
            localStorage.setItem('psycho_user', JSON.stringify(data.user))
        }      

        } catch(e){
            console.error('ERROR AL OBTENER LOS DATOS: ', e)
            succes = false;
        }
}