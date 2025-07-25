import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { registerLocale } from 'react-datepicker';
import SelectPsycho from './SelectPsycho';
import { es } from 'date-fns/locale';
registerLocale('es',es);

function Calendar({ onDateChange, onSelectPsycho }){

    const[selectedDate, setSelectedDate] = useState(null);

    function handleChange(date){
        setSelectedDate(date);
        const day = String(date.getDate()).padStart(2, '0');
        const monthName = date.toLocaleString('es-ES', {month: 'long'});
         const monthNum = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();

        onDateChange({day, month: monthName, year, monthNum});
    }

    return(
        <div className="calendar">
            <SelectPsycho
                onChange={onSelectPsycho}
            />

            <DatePicker
                selected={selectedDate}
                onChange={handleChange}
                inline 
                locale={'es'}
                minDate={new Date()}
            />
        </div>
    )
}

export default Calendar