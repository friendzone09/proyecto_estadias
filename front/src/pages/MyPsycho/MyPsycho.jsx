import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import GlobalAppoints from '../../globalComponents/appoints/GlobalAppoints'

import { getTodayString } from "../../utils/Today";

import Calendar from "./Calendar";
import './index.css'

function MyPsycho({ user }) {
    const navigate = useNavigate();
    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });
    const [info, setInfo] = useState({ psychoPhone: '', psychoName: '', patientName: '', lastDate: '', lastHour: '' })

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        if (user && (user.role == null || user.role != 'patient')) {
            navigate('/')
        }
    }, [user, navigate])

    async function getInfo() {
        if (!user || !user.asig_psycho) return;
        const today = getTodayString()
        const res = await fetchWithAuth(`${API_URL}/my_psycho_info/${user.asig_psycho}/${today}`);
        const data = await res.json();
        setInfo(data);
    }

    useEffect(() => {
        getInfo();
    }, [user]);

    if (!user) return null;

    return (
        <div className="my_psycho">
            <section className="next_appoint">
                {info.lastDate ? ('Ninguna cita agendada, solicita una') : (`Su siguiente cita es el ${info.lastDate} a las ${info.lastHour} horas`)}
            </section>

            <section className="appointments_section">
                <Calendar onDateChange={setDateParse} info={info} />
                <GlobalAppoints id_psycho={user.asig_psycho} date={dateParse} info={info} />
            </section>
        </div>

    );
};

export default MyPsycho