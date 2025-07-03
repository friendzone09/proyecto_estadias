import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

function RegisterScreen(){
    const API_URL = import.meta.env.VITE_API_URL

    const [newUser, setNewUser] = useState({name: '', lastName: '', email: '', phone: '', password:'',})

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
        formData.append('name', newUser.name) 
        formData.append('last_name', newUser.lastName) 
        formData.append('email', newUser.email) 
        formData.append('phone', newUser.phone) 
        formData.append('password', newUser.password)
    
        const response = await fetch(`${API_URL}/register`,{
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
                <input placeholder="Escribe tu correo..." value={newUser.name} 
                onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
                required/>

                <label>Apellidos</label>
                <input placeholder="Escribe tu correo..." value={newUser.lastName} 
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} 
                required />

                <label>Correo electrónico</label>
                <input placeholder="Escribe tu correo..." value={newUser.email} 
                onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                type="email" required />

                <label>Número de celular</label>
                <input type="number" placeholder="Escribe tú número" value={newUser.phone} 
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                required/>

                <label>Contraseña</label>
                <input placeholder="Escribe tu contraseña..." value={newUser.password} 
                onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                type="password" required/>

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