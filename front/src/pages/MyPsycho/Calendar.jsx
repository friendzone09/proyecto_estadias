import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
registerLocale('es',es);

function Calendar({ onDateChange, info }){

    const[selectedDate, setSelectedDate] = useState(null);

    function handleChange(date){
        setSelectedDate(date);
        const day = String(date.getDate()).padStart(2, '0');
        const monthName = date.toLocaleString('es-ES', {month: 'long'});
         const monthNum = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();

        onDateChange({day, month: monthName, year, monthNum})

    }

    return(
        <div className="calendar calendar--patient">
            <DatePicker
                selected={selectedDate}
                onChange={handleChange}
                inline 
                locale={'es'}
                minDate={new Date()}
            />
            <span>
                Llama para agendar una cita:
            </span>
            <span>Recepción:</span>
            <a className='phone_number' 
            href=
            "tel:+522412231708"
            >
                2412231708
            </a>
            <span>Su psicólogo</span>
            <a className='phone_number' href={`tel:+52${info.psychoPhone}`}>
                {info.psychoPhone}
            </a>
        </div>
    )
}

export default Calendar