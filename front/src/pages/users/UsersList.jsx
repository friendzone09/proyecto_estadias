import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWithAuth } from '../../utils/fetchWithAuth'
import { Pencil, Search, ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useToast } from "../../contexts/alert/ToastContext";
import { getAllPsychos } from "../../utils/get_user";

import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import NotResult from "../../components/NotResult/NotResul";
import { myAge } from "../../utils/myAge";

import './index.css'

function UsersList({ user }) {

    const API_URL = import.meta.env.VITE_API_URL

    const navigate = useNavigate();
    const { addAlert } = useToast();
    const dialogRef = useRef();
    const deleteDialogRef = useRef();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [psychos, setPsychos] = useState([]);
    const perPage = 5;

    async function callUsers(currentPage = 1, text = searchText) {

        setLoading(true);

        const query = text.trim() === '' ? 'none' : text.trim();

        const res = await fetchWithAuth(`${API_URL}/get_all_users?page=${currentPage}&per_page=${perPage}&search=${query}`);
        const data = await res.json();

        console.log(data.users)
        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / perPage));
        setLoading(false);
    }

    async function deleteUserForId(userId) {
        setDeleteUser(null);

        const res = await fetchWithAuth(`${API_URL}/delete_user/${userId}`, {method: 'DELETE'});
        const data = await res.json();

        addAlert(data.message, data.type);
        await callUsers();
    }

    async function editUser(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', JSON.stringify(selectedUser));
        setSelectedUser(null);
        const res = await fetchWithAuth(`${API_URL}/edit_user`, { method: 'PUT', body: formData });
        const data = await res.json();

        addAlert(data.message, data.type);
        if (data.type == 'success') {
            setPage(1)
            setSearchText('')
            await callUsers();
        }
    }

    useEffect(() => {
        async function callPsychos() {
            const data = await getAllPsychos();
            setPsychos(data);
        }
        callPsychos();
    }, [])

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

    useEffect(() => {
        if (deleteUser && deleteDialogRef.current) {
            deleteDialogRef.current.showModal();
        } else if (deleteDialogRef.current && deleteDialogRef.current.open) {
            deleteDialogRef.current.close();
        }
    }, [deleteUser]);

    if (!user) return null;

    return (
        <div className="user_table_section">

            <div className="table_section">

                <div className="section_var">
                    <div className="new_user_button">
                        <Link className="button_new_user" to={'/admin/users/new'}>Nuevo usuario</Link>
                    </div>

                    <div className="search_var">
                        <input type="text" placeholder="Buscar..." value={searchText} onInput={e => {
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
                                        <th>Edad</th>
                                        <th>Editar</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.user_id}>
                                            <td> {u.user_name} {u.user_last_name}  </td>
                                            <td> {u.user_email} </td>
                                            <td>{u.user_phone}</td>
                                            <td> {u.user_role == 'patient' ? ('Paciente') : ('Psicólogo')}</td>
                                            <td> {myAge(u.user_age)} años</td>
                                            <td><button onClick={() => setSelectedUser(u)}>Editar <Pencil size={15} /></button></td>
                                            <td><button onClick={() => setDeleteUser(u)} >Eliminar <Trash2 size={15} /></button></td>
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

                <span> {page} / {totalPages}</span>

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

                    <form className="modal_edit_user--form" onSubmit={(e) => { editUser(e) }}>
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
                            maxLength={15}
                            onInput={(e) => {
                            // Solo permite dígitos
                            const onlyNums = e.target.value.replace(/\D/, '');
                            selectedUser ? (setSelectedUser({...selectedUser, user_phone: onlyNums})) : null;
                        }}
                        />

                        {selectedUser &&
                            selectedUser.user_role === 'patient' &&
                            <>
                                <label>Psicólogo asignado</label>
                                <select
                                    value={selectedUser.assig_psycho || ''}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, assig_psycho: e.target.value })}
                                >
                                    <option value="">Sin psicólogo asignado</option>
                                    {psychos.map(p => (
                                        <option value={p.id} key={p.id}>
                                            {p.name} {p.last_name}
                                        </option>
                                    ))}
                                </select>

                                <label>Tipo de consulta</label>
                                <select
                                value={selectedUser.appoint_type || 'single'}
                                onChange={(e) => setSelectedUser({...selectedUser, appoint_type: e.target.value})}
                                >
                                    <option value={'single'}>Individual</option>
                                    <option value={'couple'}>Pareja</option>
                                    <option value={'family'}>Familiar</option>
                                </select>

                            </>
                        }

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

            <dialog
                ref={deleteDialogRef}
                className="modal_edit_user"
                onClick={() => setDeleteUser(null)}
            >
                <div className="modal_edit_user--content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal_edit_user--close">
                        <h1>Eliminar usuario</h1>
                        <span onClick={() => setDeleteUser(null)}><X /></span>
                    </div>

                    <p>¿Estás seguro de que deseas eliminar al {deleteUser&& deleteUser.user_role == 'patient'? ('paciente') : ('psicólogo')}  <strong>{deleteUser?.user_name} {deleteUser?.user_last_name}</strong>?</p>

                    <div className="modal_edit_user--actions">
                        <span onClick={() => setDeleteUser(null)}>Cancelar</span>
                        <button onClick={()=> deleteUserForId(deleteUser.user_id)}>Eliminar</button>
                    </div>
                </div>
            </dialog>

        </div>

    );
}

export default UsersList;