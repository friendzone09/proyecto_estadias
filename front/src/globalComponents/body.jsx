import Header from "./header";
import Main from "./main";
import Footer from "./footer";
import CookiesAlert from "../components/CookiesAlert/CookiesAlert";
import '../static/styles/global.css'
import '../static/styles/responsive.css'
import { fetchWithAuth } from "../utils/fetchWithAuth";
import React from "react";
import { useState, useEffect } from "react";
import { useLoading } from "../contexts/loading/LoadingContext";
import { UserContext } from "../contexts/userContext/UserContext";
import { useToast } from "../contexts/alert/ToastContext";
import ConnectionError from "../pages/Errors/ConecctionError/ConnectionError";

function Body({ children }) {

    const API_URL = import.meta.env.VITE_API_URL

    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [cookieAlert, setCookieAlert] = useState(false);
    const { setLoading } = useLoading();
    const { addAlert } = useToast();

    async function fetchUser() {
        const response = await fetchWithAuth(`${API_URL}/get_all_user_info`);
        const data = await response.json();
        if (data.type=='warning') {addAlert(data.message, data.type)}
        return data.user;
    }

    useEffect(() => {
        async function fetch() {
            setLoading(true);
            try {
                const fetchedUser = await fetchUser();
                setUser(fetchedUser);
                if (fetchedUser.role == null){setCookieAlert(true)}
            } catch (err) {
                console.error('Error al obtener el usuario:', err);
                setError(true);
                setLoading(false);
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
            <CookiesAlert onClose={()=> setCookieAlert(false)}  open={cookieAlert ? 'open': 'close'}  />
            <Main>{React.cloneElement(children, { user })}</Main>
            <Footer />
        </UserContext.Provider>
    )
}

export default Body