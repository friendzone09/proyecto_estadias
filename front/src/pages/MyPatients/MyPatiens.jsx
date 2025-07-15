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
                        <input type="text" placeholder="Buscar..." />
                        <button><Search size={20} /></button>
                    </div>
                </div>

                <div className="users_table">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Numero</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={1}>
                                <td> ejemplo </td>
                                <td> ejemplo </td>
                                <td> ejemplo</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>

            <div className="paginator">
                <button>
                    <ChevronLeft />
                </button>

                <span></span>

                <button>
                    <ChevronRight />
                </button>
            </div>

        </div>
    )
}

export default MyPatients