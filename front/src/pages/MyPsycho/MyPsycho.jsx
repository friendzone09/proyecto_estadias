import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalAppoints from '../../globalComponents/appoints/GlobalAppoints'
import Calendar from "./Calendar";
import './index.css'

function MyPsycho({ user }) {
    const navigate = useNavigate();
    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });

    useEffect(() => {
        if (user && (user.role == null || user.role != 'patient')) {
            navigate('/')
        }
    }, [user, navigate])

    if (!user) return null;

    return (
        <section className="appointments_section">
            <Calendar onDateChange={setDateParse} user={user}/>
            <GlobalAppoints id_psycho={user.asig_psycho} date={dateParse} />
        </section>
    );
};

export default MyPsycho