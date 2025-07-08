import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { registerLocale } from 'react-datepicker';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { es } from 'date-fns/locale';
registerLocale('es',es);

function Calendar({ onDateChange, user }){
    const API_URL = import.meta.env.VITE_API_URL

    const[selectedDate, setSelectedDate] = useState(null);
    const[psychoInfo, setPsychoInfo] = useState({psychoPhone : '', psychoName: '', patientName: ''})

    function handleChange(date){
        setSelectedDate(date);
        const day = String(date.getDate()).padStart(2, '0');
        const monthName = date.toLocaleString('es-ES', {month: 'long'});
         const monthNum = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();

        onDateChange({day, month: monthName, year, monthNum})

    }

    useEffect(()=>{
        async function getNumber() {
            const res = await fetchWithAuth(`${API_URL}/my_psycho_info/${user.asig_psycho}`);
            const data = await res.json();
            console.log(data);
            setPsychoInfo(data);
        }
        getNumber();
    }, [])

    return(
        <div className="calendar calendar--patient">
            <DatePicker
                selected={selectedDate}
                onChange={handleChange}
                inline 
                locale={'es'}
            />
            <span>
                Agendar una cita:
            </span>
            <span>Recepción:</span>
            <a className='phone_number' 
            href=
            "https://wa.me/+522412231708?text=Hola%20quiero%20más%20información"
            >
                2412231708
            </a>
            <span>Su psicólogo</span>
            <a className='phone_number' href='/hola'>
                {psychoInfo.psychoPhone}
            </a>
        </div>
    )
}

export default Calendar