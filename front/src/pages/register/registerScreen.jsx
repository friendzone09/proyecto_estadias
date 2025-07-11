import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/alert/ToastContext.jsx";

import LoadingCircle from '../../components/LoadingCircle/LoadingCircle.jsx'

function RegisterScreen() {
    const API_URL = import.meta.env.VITE_API_URL

    const [newUser, setNewUser] = useState({ name: '', lastName: '', email: '', phone: '', password: '', })
    const [loading, setLoading] = useState(false)
    const { addAlert } = useToast();
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        import('./ballsAnimation.js').then((module) => {
            module.default();
        });
    }, [])

    async function registerUser(e) {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append('name', newUser.name)
        formData.append('last_name', newUser.lastName)
        formData.append('email', newUser.email)
        formData.append('phone', newUser.phone)
        formData.append('password', newUser.password)

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.type == 'success') {
            addAlert(data.message, data.type)
            navigate('/login');
            setLoading(false);
        }
        else {
            setLoading(false)
            setErrorMessage(data.message);
        }
    }
    return (
        <>

            <canvas></canvas>

            <form className="login_squere" onSubmit={registerUser}>
                {loading ? (<LoadingCircle />) : (
                    <>
                        <h1>Registrate</h1>

                        <label>Nombre</label>
                        <input placeholder="Escribe tu correo..." value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            required />

                        <label>Apellidos</label>
                        <input placeholder="Escribe tu correo..." value={newUser.lastName}
                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                            required />

                        <label>Correo electrónico</label>
                        <input placeholder="Escribe tu correo..." value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            type="email" required />

                        <label>Número de celular</label>
                        <input type="text" placeholder="Escribe tú número" value={newUser.phone}
                            maxLength={15}
                            onChange={(e) => {
                            // Solo permite dígitos
                            const onlyNums = e.target.value.replace(/\D/, '');
                            setNewUser({ ...newUser, phone: onlyNums });
                        }}
                            required />

                        <label>Contraseña</label>
                        <input placeholder="Escribe tu contraseña..." value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            type="password" required />

                        {errorMessage && (
                            <small>{errorMessage}</small>
                        )}

                        <button>Registrate</button>

                        <a href="/login">Inica sesión</a>
                    </>
                )}
            </form>
        </>
    )
}

export default RegisterScreen