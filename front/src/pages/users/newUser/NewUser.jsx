import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/alert/ToastContext";

function NewUser({ user }) {

    const navigate = useNavigate();
    const { addAlert } = useToast();
    const [newUser, setNewUser] = useState({ name: '', lastName: '', email: '', phone: '', password: '' });

    async function registerUser(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', newUser.name)
        formData.append('last_name', newUser.lastName)
        formData.append('email', newUser.email)
        formData.append('phone', newUser.phone)
        formData.append('password', newUser.password)

        const response = await fetch('http://127.0.0.1:5000/api/register', {
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

    if (!user) return null

    return (
        <form className="register_new_user" onSubmit={registerUser}>
            <div className="new_user_section">
                <div className="input_section">
                    <label>Nombre(s)</label>
                    <input type="text" placeholder="Nombre..." required value={newUser.name}
                        onChange={(e) => { setNewUser({ ...newUser, name: e.target.value }) }}
                    />
                </div>
                <div className="input_section">
                    <label>Apellidos</label>
                    <input type="text" placeholder="Apellidos..." required value={newUser.lastName}
                        onChange={(e) => { setNewUser({ ...newUser, lastName: e.target.value }) }}
                    />
                </div>
            </div>

            <div className="new_user_section">
                <div className="input_section">
                    <label>Correo</label>
                    <input type="email" placeholder="Correo..." required value={newUser.email}
                        onChange={(e) => { setNewUser({ ...newUser, email: e.target.value }) }}
                    />
                </div>
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
            </div>

            <div className="new_user_section">
                <div className="input_section">
                    <label>Contraseña</label>
                    <input type="password" placeholder="Contraseña..." required value={newUser.password}
                        onChange={(e) => { setNewUser({ ...newUser, password: e.target.value }) }}
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