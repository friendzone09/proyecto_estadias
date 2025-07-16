import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fetchWithAuth } from "../../utils/fetchWithAuth";

import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import NotResult from "../../components/NotResult/NotResul";

function MyPatients({ user }) {

    const API_URL = import.meta.env.VITE_API_URL

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const perPage = 5;

    async function callUsers(currentPage = 1, text = searchText) {

        setLoading(true);

        const query = text.trim() === '' ? 'none' : text.trim();

        const res = await fetchWithAuth(`${API_URL}/my-patients?page=${currentPage}&per_page=${perPage}&search=${query}`);
        const data = await res.json();

        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / perPage));
        setLoading(false);
    }

    useEffect(() => {
        if (user && (user.role !== 'psycho')) {
            navigate('/');
        }
    }, [user, navigate])

    useEffect(() => {
        if (user) callUsers(page);
    }, [page, user, searchText]);

    useEffect(() => {
        callUsers(1)
    }, [searchText])

    if (!user) return null;

    return (
        <div className="user_table_section">
            <div className="table_section">

                <div className="section_var">

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

                        users.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Numero</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.user_id}>
                                            <td> {u.user_name} {u.user_last_name} </td>
                                            <td> {u.user_email} </td>
                                            <td> {u.user_phone} </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ): ( <NotResult/> )

                        )}
                </div>
            </div>

            <div className="paginator">
                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1 || users.length == 0}>
                    <ChevronLeft />
                </button>

                <span> {page} / {totalPages} </span>

                <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages || users.length == 0}>
                    <ChevronRight />
                </button>
            </div>

        </div>
    )
}

export default MyPatients