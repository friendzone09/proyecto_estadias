import { getUser } from "../../utils/get_user"
import './index.css'

import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "../../components/alert/ToastContext"

import PsychoImage from "./PsychoImage"
import PsychoDescription from "./PsychoDescription"

function Profile(){
    const location = useLocation();
    const { addAlert } = useToast();
    const navigate = useNavigate()
    const [psycho, setPsycho] = useState(null);

    const toastShown = useRef(false);

     useEffect(() => {
        if (location.state?.toast && !toastShown.current) {
            const { type, message } = location.state.toast;
            addAlert(message, type);
            toastShown.current = true;
            navigate(location.pathname, { replace: true });
        }
    }, [location, addAlert, navigate]);

    useEffect(()=>{
        
        const data = getUser();

        if (!data || data.type === false) {
            navigate('/');
        } else {
            setPsycho(data);
        }
        

    }, [])

    if (!psycho) return null;

    return(

        <section className="pyscho_profile_section">
            <PsychoImage imageName = {psycho.image } name={psycho.name} lastName={psycho.last_name}/>
            <PsychoDescription  />
        </section>

    )
}

export default Profile