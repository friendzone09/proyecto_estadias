import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/loginUser.js";
import LoadingCircle from '../../components/LoadingCircle/LoadingCircle.jsx'
import { Link } from "react-router-dom";
import './index.css'

function LoginScreen(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        import('./ballsAnimation.js').then((module) => {
            if (module.default) {
                module.default();
            }
    });
    }, [])

    async function loginUser(e) {
        e.preventDefault();
        setLoading(true)

        const data = await login({ email, password });

        if (data.type === 'success') {
            setLoading(false)
            navigate('/');
        } else {
            setErrorMessage(data.message);
            setLoading(false)
        }
    }

    return(
        <>
            <canvas></canvas>

            <form className="login_squere" onSubmit={loginUser}>
                {loading ? (<LoadingCircle/>) : 
                (<>
                    <h1>Inicia sesión</h1>

                    <label>Correo electrónico</label>
                    <input placeholder="Escribe tu correo..." value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

                    <label>Contraseña</label>
                    <input placeholder="Escribe tu contraseña..." value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

                    {errorMessage && (
                        <small>{errorMessage}</small>
                    )}

                    <button className="submit">Iniciar sesión</button>

                    <Link to={'/register'} >Registrarse</Link>
                </>
                )
                }
            </form>
        </>      
    )
}

export default LoginScreen