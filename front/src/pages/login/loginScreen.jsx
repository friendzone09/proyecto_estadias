import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import './index.css'

function LoginScreen(){

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        import('./ballsAnimation.js').then((module) => {
            if (module.default) {
                module.default();
            }
    });
    }, [])

    async function loginUser(e){

        e.preventDefault();

        let succes = true;
        
        const formData = new FormData();
        formData.append('email', email) 
        formData.append('password', password)
        
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
                navigate('/')
            } 

        }catch(e){
            console.error('ERROR AL INICIAR SESION: ', e)
            succes = false;
        }

        
       
    }

    return(
        <>
            <canvas></canvas>

            <form className="login_squere" onSubmit={loginUser}>
                <h1>Inicia sesión</h1>

                <label>Correo electrónico</label>
                <input placeholder="Escribe tu correo..." value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

                <label>Contraseña</label>
                <input placeholder="Escribe tu contraseña..." value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

                <button>Iniciar sesión</button>

                <a href="/register">Registrarse</a>
            </form>
        </>      
    )
}

export default LoginScreen