import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import './index.css'

function RegisterScreen(){

    const[name, setName] = useState('');
    const[lastName, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate()

    useEffect(()=>{
        import('./ballsAnimation.js').then((module) => {
            module.default();
        });
    }, [])

    async function registerUser(e){

        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name) 
        formData.append('last_name', lastName) 
        formData.append('email', email) 
        formData.append('password', password)
    
        const response = await fetch('http://127.0.0.1:5000/register',{
            method : 'POST',
            body : formData
        });

        const data = await response.json();

        if(data.type == 'success') navigate('/login');

        else{
            setErrorMessage(data.message);
        }

    }


    return(
        <>

            <canvas></canvas>

            <form className="login_squere" onSubmit={registerUser}>
                <h1>Registrate</h1>

                <label>Nombre</label>
                <input placeholder="Escribe tu correo..." value={name} onChange={(e) => setName(e.target.value)} required/>

                <label>Apellidos</label>
                <input placeholder="Escribe tu correo..." value={lastName} onChange={(e) => setLastName(e.target.value)} required />

                <label>Correo electrónico</label>
                <input placeholder="Escribe tu correo..." value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

                <label>Contraseña</label>
                <input placeholder="Escribe tu contraseña..." value={password} onChange={(e) => setPassword(e.target.value)} type="password" required/>

                {errorMessage && (
                    <small>{errorMessage}</small>
                )}

                <button>Registrate</button>

                <a href="/login">Inica sesión</a>
            </form>
        </>
        
            
       
    )
}

export default RegisterScreen