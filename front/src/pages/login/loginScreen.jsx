import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../../utils/loginUser.js";
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
        
        const formData = new FormData();
        formData.append('email', email) 
        formData.append('password', password)

        login(formData)
             
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