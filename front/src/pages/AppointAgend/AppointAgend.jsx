import Calendar from "./Calendar"
import Appointments from "./Appointments"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";

function AppointAgend (){

    const { id_psycho } = useParams();

    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });

    return (
        <section className="appointments_section">
            <Calendar onDateChange = {setDateParse} />
            <Appointments date = {dateParse} id_psycho={id_psycho} />
        </section>
    )
}
export default AppointAgend
