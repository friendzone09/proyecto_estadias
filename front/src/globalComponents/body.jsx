import Header from "./header";
import Main from "./main";
import Footer from "./footer";
import '../static/styles/global.css'
import { fetchWithAuth } from "../utils/fetchWithAuth";
import React from "react";
import { useState, useEffect } from "react";
import { useLoading } from "../contexts/loading/LoadingContext";
import { UserContext } from "../contexts/userContext/UserContext";
import { useToast } from "../contexts/alert/ToastContext";
import ConnectionError from "../pages/Errors/ConecctionError/ConnectionError";

function Body({ children }) {

    const [user, setUser] = useState(null);
    const [error, setError] = useState(false)
    const { setLoading } = useLoading();
    const { addAlert } = useToast();

    async function fetchUser() {
        const response = await fetchWithAuth('http://localhost:5000/api/get_all_user_info');
        const data = await response.json();
        if (data.type=='warning' || data.type=='info') {addAlert(data.message, data.type)}
        return data.user;
    }

    useEffect(() => {
        async function fetch() {
            setLoading(true);
            try {
                const fetchedUser = await fetchUser();
                setUser(fetchedUser);
            } catch (err) {
                console.error('Error al obtener el usuario:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    if (error) return <ConnectionError />

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Header user={user} />
            <Main>{React.cloneElement(children, { user })}</Main>
            <Footer />
        </UserContext.Provider>
    )
}

export default Body