import { useState, useEffect } from "react";
import { getHours } from "../../../utils/getSchedule";
import { updateHours } from "../../../utils/updateHours";
import { useToast } from "../../../contexts/alert/ToastContext";
import LoadingCircle from '../../../components/LoadingCircle/LoadingCircle'

import { useUser } from "../../../contexts/userContext/UserContext";

import HoursInDay from "./HoursInDay";
import DayInSchedule from "./DayInSchedule";

function ShowHours({ selectedDay }) {

    const { user } = useUser();
    const { addAlert } = useToast();

    const [hours, setHours] = useState([]);
    const [day, setDay] = useState({});
    const [modifiedHours, setModifiedHours] = useState([]);
    const [originalLaboralDay, setOriginalLaboralDay] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleToggleHour(id_hour) {
        const updatedHours = hours.map(h =>
            h.id_hour === id_hour ? { ...h, hour_status: !h.hour_status } : h
        );
        setHours(updatedHours);

        const originalHour = hours.find(h => h.id_hour === id_hour);
        const changedHour = updatedHours.find(h => h.id_hour === id_hour);

        setModifiedHours(prev => {
            const exists = prev.find(h => h.id_hour === id_hour);

            if (changedHour.hour_status === originalHour.hour_status) {
                return prev.filter(h => h.id_hour !== id_hour);
            }

            if (exists) {
                return prev.map(h => h.id_hour === id_hour ? changedHour : h);
            }

            return [...prev, changedHour];
        });

    };

    function handleToggleDay() {
        setDay(prevDay => ({
            ...prevDay,
            laboral_day: !prevDay.laboral_day
        }));
    };

    async function changeHour() {
        setLoading(true)

        const dayChanged = day.laboral_day !== originalLaboralDay;
        const hoursChanged = modifiedHours.length > 0;

        if (dayChanged || hoursChanged) {
            const formData = new FormData()

            formData.append('id_day', day.id_day);
            formData.append('laboral_day', day.laboral_day);
            formData.append('psycho_id', user.id);
            formData.append('modified_hours', JSON.stringify(modifiedHours));

            const data = await updateHours(formData);

            addAlert(data.message, data.type)
            setModifiedHours([]);
        } else {
            alert('Sin modificaciones')
        }

        setLoading(false)

    };

    useEffect(() => {

        if (selectedDay !== null && selectedDay !== 0) {
            async function fetchHours() {
                setLoading(true)

                const schedule = await getHours(user.id, selectedDay)

                setHours(schedule.hours);
                setDay(schedule.day);
                setOriginalLaboralDay(schedule.day.laboral_day);
                setModifiedHours([]);

                setLoading(false)
            };
            fetchHours();
        } else {
            setHours([]);
        }

    }, [selectedDay])

    return (
        <div className="show_hours">

            {loading ? (<LoadingCircle/>) : (
                selectedDay ? (
                <div className="day_and_hours">
                    <div className="day">
                        <DayInSchedule
                            dayName={day.day_name}
                            dayStatus={day.laboral_day ?? false}
                            onToggleDay={handleToggleDay}
                        />
                    </div>

                    {day.laboral_day ? (
                        <div className="hours_in_day">
                            {hours.map(h => (<HoursInDay
                                key={h.id_hour}
                                hour={h.hour}
                                status={h.hour_status ?? false}
                                onToggle={() => handleToggleHour(h.id_hour)} />))}
                        </div>) :
                        (<p>Descanso</p>)}

                    <div className="acept_hour_changes">
                        <button onClick={changeHour} >Guardar</button>
                    </div>

                </div>
            ) : (
                <p>Selecciona un día para ver las horas</p>
            )
            )}

        </div>
    )
}

export default ShowHours