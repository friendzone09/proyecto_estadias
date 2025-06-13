import './index.css'

import { useEffect, useRef } from "react"
import { useNavigate, useLocation, Await } from "react-router-dom"
import { useToast } from '../../contexts/alert/ToastContext'

import PsychoImage from "./PsychoImage"
import PsychoDescription from "./PsychoDescription"

function Profile({ user }) {
    const location = useLocation();
    const { addAlert } = useToast();
    const navigate = useNavigate()

    const toastShown = useRef(false);

    useEffect(() => {
        if (location.state?.toast && !toastShown.current) {
            const { type, message } = location.state.toast;
            addAlert(message, type);
            toastShown.current = true;
            navigate(location.pathname, { replace: true });
        }
    }, [location, addAlert, navigate]);

    useEffect(() => {
        if (user && (user.role !== 'psycho')) {
            navigate('/')
        }
    }, [user, navigate])

    if (!user) return null;

    return (

        <section className="pyscho_profile_section">
            <PsychoImage user={user} />
            <PsychoDescription PsychoDescription={user.description} />
        </section>

    )
}

export default Profile