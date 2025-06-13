import Header from "./header";
import Main from "./main";
import Footer from "./footer";
import '../static/styles/global.css'
import { getUser } from "../utils/get_user";
import React from "react";
import { useState, useEffect } from "react";
import { useLoading } from "../contexts/loading/LoadingContext";
import { UserContext } from "../contexts/userContext/UserContext";
import ConnectionError from "../pages/Errors/ConecctionError/ConnectionError";

function Body({ children }) {

    const [user, setUser] = useState(null);
    const [error, setError] = useState(false)
    const { setLoading } = useLoading();

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try {
                const fetchedUser = await getUser();
                setUser(fetchedUser);
            } catch (err) {
                console.error('Error al obtener el usuario:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    if(error) return <ConnectionError/>

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Header user={user} />
            <Main>{React.cloneElement(children, { user })}</Main>
            <Footer />
        </UserContext.Provider>
    )
}

export default Body