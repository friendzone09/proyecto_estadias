import { useState } from 'react';

function SelectDay({ onDayChange }) {
    const [selectedDay, setSelectedDay] = useState('');

    const handleChange = (e) => {
        const day = parseInt(e.target.value);
        setSelectedDay(day);
        onDayChange(day);
    };

    return (
        <div className="select_day">
            <select value={selectedDay ?? ''} onChange={handleChange}>
                <option value={0}>Selecciona un día</option>
                <option value={1} >Lunes</option>
                <option value={2}>Martes</option>
                <option value={3} >Miércoles</option>
                <option value={4}>Jueves</option>
                <option value={5}>Viernes</option>
                <option value={6}>Sábado</option>
                <option value={7}>Domingo</option>
            </select>
        </div>
    );
}

export default SelectDay;