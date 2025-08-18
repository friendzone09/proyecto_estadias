import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/alert/ToastContext";
import { getAllPsychos } from "../../../utils/get_user";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";

function NewUser({ user }) {
    const API_URL = import.meta.env.VITE_API_URL

    const navigate = useNavigate();
    const { addAlert } = useToast();
    const [newUser, setNewUser] = useState({ name: '', lastName: '', email: '', phone: '', password: '', psychoId: null, dateAge: null, appointType: 'single' });
    const [psychos, setPsychos] = useState([]);

    useEffect(() => {
        async function callPsychos() {
            const data = await getAllPsychos();
            setPsychos(data);
        }
        callPsychos();
    }, [])

    async function registerUser(e) {
        e.preventDefault();

        newUser.psychoId = user.role == 'psycho'&& (user.id);

        const formData = new FormData();
        formData.append('name', newUser.name.trim());
        formData.append('last_name', newUser.lastName.trim());
        formData.append('email', newUser.email);
        formData.append('phone', newUser.phone);
        formData.append('date_age', newUser.dateAge);
        formData.append('appoint_type', newUser.appointType);
        formData.append('password', newUser.password);
        formData.append('psycho_id', newUser.psychoId);

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.type == 'success') {
            addAlert(data.message, data.type)
            navigate('/admin/users')
        }
        else {
            addAlert(data.message, data.type);
        }
    }

    if (!user || !psychos) return null

    return (
        <form className="register_new_user" onSubmit={registerUser} autoComplete="off">
            <div className="new_user_section">
                <div className="input_section">
                    <label>Nombre(s)</label>
                    <input type="text" placeholder="Nombre..." required value={newUser.name}
                        onChange={(e) => { setNewUser({ ...newUser, name: e.target.value.trimStart() }) }}
                    />
                </div>
                <div className="input_section">
                    <label>Apellidos</label>
                    <input type="text" placeholder="Apellidos..." required value={newUser.lastName}
                        onChange={(e) => { setNewUser({ ...newUser, lastName: e.target.value.trimStart() }) }}
                    />
                </div>
            </div>

            <div className="new_user_section">
                <div className="input_section">
                    <label>Telefono</label>
                    <input
                        type="text"
                        placeholder="Teléfono..."
                        required
                        value={newUser.phone}
                        maxLength={15}
                        onChange={(e) => {
                            // Solo permite dígitos
                            const onlyNums = e.target.value.replace(/\D/, '');
                            setNewUser({ ...newUser, phone: onlyNums });
                        }}
                    />
                </div>

                <div className="input_section">
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
                </div>
            </div>

            <div className="new_user_section">
                {user.role === 'admin' && (
                    <div className="input_section">
                    <label>Psicólogo</label>
                    <select onChange={(e) => {
                        const value = e.target.value;
                        setNewUser({ ...newUser, psychoId: value === "" ? null : value });
                    }}>
                        <option value=''>Selecciona un psicólogo</option>
                        {psychos.map(p => (
                            <option value={p.id} key={p.id}> {p.name} {p.last_name} </option>
                        ))}
                    </select>
                </div>
                )}

                <div className="input_section">
                    <label>Tipo de consulta</label>
                    <select   onChange={(e) => setNewUser({ ...newUser, appointType: e.target.value})}>
                                    <option value="single">Individual</option>
                                    <option value="couple">Pareja</option>
                                    <option value="family">Familiar</option>
                    </select>
                </div>
            </div>

            <div className="new_user_section">

                <div className="input_section">
                    <label>Correo (opcional)</label>
                    <input type="email" placeholder="Correo..." value={newUser.email}
                        onChange={(e) => { setNewUser({ ...newUser, email: e.target.value }) }}
                    />
                </div>

                <div className="input_section">
                    <label>Contraseña (opcional)</label>
                    <input type="password" placeholder="Contraseña..." value={newUser.password}
                        onChange={(e) => { setNewUser({ ...newUser, password: e.target.value }) }}
                        autocomplete="new-password"
                    />
                </div>
            </div>

            <div className="button_register_new_user">
                <button>Guardar</button>
            </div>
        </form>
    )
}

export default NewUser