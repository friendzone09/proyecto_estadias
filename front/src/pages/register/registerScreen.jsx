import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/alert/ToastContext.jsx";
import { ArrowRight, ArrowLeft } from "lucide-react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";

import LoadingCircle from '../../components/LoadingCircle/LoadingCircle.jsx'

function RegisterScreen() {
    const API_URL = import.meta.env.VITE_API_URL

    const [newUser, setNewUser] = useState({ name: '', lastName: '', email: '', phone: '', password: '', dateAge: null, appointType : 'single'})
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1);
    const { addAlert } = useToast();
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

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
        formData.append('date_age', newUser.dateAge)
        formData.append('appoint_type', newUser.appointType)
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

                        {step === 1 && (
                            <>
                                <label>Nombre</label>
                                <input placeholder="Escribe tu nombre..." value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    required />

                                <label>Apellidos</label>
                                <input placeholder="Escribe tus apellidos..." value={newUser.lastName}
                                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                    required />

                                <label>Fecha de nacimiento</label>
                                <DatePicker
                                selected={newUser.dateAge}
                                onChange={(date) => setNewUser({ ...newUser, dateAge: date.toISOString().split('T')[0] })}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Selecciona tu fecha de nacimiento"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                maxDate={new Date()}
                                locale="es"
                                />

                                <label>Tipo de consulta</label>
                                <select   onChange={(e) => setNewUser({ ...newUser, appointType: e.target.value})}>
                                    <option value="single">Individual</option>
                                    <option value="couple">Pareja</option>
                                    <option value="family">Familiar</option>
                                </select>

                                <div className="changes_buttons">
                                    <button className="change_form" onClick={nextStep}>Siguiente <ArrowRight size={18}/> </button>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
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

                                <button className="change_form" onClick={prevStep}> <ArrowLeft size={18}/> Anterior</button>

                                <button className="submit">Registrarse</button>
                            </>
                        )}

                        {errorMessage && (
                            <small>{errorMessage}</small>
                        )}

                        <a href="/login">Inica sesión</a>
                    </>
                )}
            </form>
        </>
    )
}

export default RegisterScreen

//PRIMER FORMULARIO:
//NOMBRE, APELLIDOS, EDAD, TIPO DE CONSULTA.
//SEGUNDO FORMULARIO:
//EMAIL, NUMERO, CONTRASEÑA