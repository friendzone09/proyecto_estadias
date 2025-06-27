import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWithAuth } from '../../utils/fetchWithAuth'
import { Pencil, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef } from "react";
import { useToast } from "../../contexts/alert/ToastContext";

import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import NotResult from "../../components/NotResult/NotResul";

import './index.css'

function UsersList({ user }) {
    const navigate = useNavigate();
    const { addAlert } = useToast();
    const dialogRef = useRef();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const perPage = 5;

    async function callUsers(currentPage = 1, text = searchText) {
        setLoading(true);

        const query = text.trim() === '' ? 'none' : text.trim();

        console.log(`http://localhost:5000/api/get_all_users?page=${currentPage}&per_page=${perPage}&search=${query}`);

        const res = await fetchWithAuth(`http://localhost:5000/api/get_all_users?page=${currentPage}&per_page=${perPage}&search=${query}`);
        const data = await res.json();

        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / perPage));
        setLoading(false);
    }

    async function editUser(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', JSON.stringify(selectedUser));
        setSelectedUser(null);
        const res = await fetchWithAuth('http://localhost:5000/api/edit_user', { method: 'PUT', body: formData });
        const data = await res.json();

        addAlert(data.message, data.type);
        if (data.type == 'success') { await callUsers() }
    }

    useEffect(() => {
        if (user && (user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user) callUsers(page);
    }, [page, user, searchText]);

    useEffect(() => {
        callUsers(1)
    }, [searchText])

    useEffect(() => {
        if (selectedUser && dialogRef.current) {
            dialogRef.current.showModal();
        } else if (dialogRef.current && dialogRef.current.open) {
            dialogRef.current.close();
        }
    }, [selectedUser]);

    if (!user) return null;

    return (
        <div className="user_table_section">

            <div className="table_section">

                <div className="section_var">
                    <div className="new_user_button">
                        <Link className="button_new_user" to={'/admin/users/new'}>Nuevo usuario</Link>
                    </div>

                    <div className="search_var">
                        <input type="text" placeholder="Buscar..." onInput={e => {
                            setSearchText(e.target.value);
                            setPage(1);
                        }} />
                        <button><Search size={20} /></button>
                    </div>
                </div>

                <div className="users_table">
                    {loading ? (<LoadingCircle />) :
                        (
                            users.length > 0 ? (<table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Numero</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.user_id}>
                                            <td> {u.user_name} {u.user_last_name}  </td>
                                            <td> {u.user_email} </td>
                                            <td>{u.user_phone}</td>
                                            <td> {u.user_role == 'patient' ? ('Paciente') : ('Psicólogo')}</td>
                                            <td><button onClick={() => setSelectedUser(u)}>Editar <Pencil size={15} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>) : (<NotResult />)
                        )
                    }
                </div>
            </div>

            <div className="paginator">
                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1 || users.length == 0}>
                    <ChevronLeft />
                </button>

                <span> {page} /{totalPages}</span>

                <button onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages || users.length == 0}>
                    <ChevronRight />
                </button>
            </div>

            <dialog
                ref={dialogRef}
                className="modal_edit_user"
                onClick={() => setSelectedUser(null)}
            >
                <div className="modal_edit_user--content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal_edit_user--close">
                        <h1>Editar usuario</h1>
                        <span onClick={() => setSelectedUser(null)}><X /></span>
                    </div>

                    <form className="modal_edit_user--form" onSubmit={(e) => editUser(e)}>
                        <label>Nombre</label>
                        <input type="text" value={selectedUser ? selectedUser.user_name : ''}
                            onInput={e => { selectedUser ? setSelectedUser({ ...selectedUser, user_name: e.target.value }) : null }}
                            required
                        />

                        <label>Apellidos</label>
                        <input type="text" value={selectedUser ? selectedUser.user_last_name : ''}
                            onInput={e => { selectedUser ? setSelectedUser({ ...selectedUser, user_last_name: e.target.value }) : null }}
                        />

                        <label>Correo</label>
                        <input type="email" value={selectedUser ? selectedUser.user_email : ''}
                            onInput={e => { selectedUser ? setSelectedUser({ ...selectedUser, user_email: e.target.value }) : null }}
                        />

                        <label>Numero</label>
                        <input type="text" value={selectedUser ? selectedUser.user_phone : ''}
                            onInput={e => { selectedUser ? setSelectedUser({ ...selectedUser, user_phone: e.target.value }) : null }}
                        />

                        <label>Tipo</label>
                        <select
                            value={selectedUser ? selectedUser.user_role : ''}
                            onChange={e => { selectedUser ? setSelectedUser({ ...selectedUser, user_role: e.target.value }) : null }}
                        >
                            <option value="psycho">Psicólogo</option>
                            <option value="patient">Paciente</option>
                        </select>

                        <button type="submit">Guardar</button>
                    </form>

                </div>
            </dialog>

        </div>

    );
}

export default UsersList;