import Calendar from "./Calendar"
import Appointments from "./Appointments"
import { useState, useEffect } from "react"
import './index.css'

function Dates (){

    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });

    return (
        <section className="appointments_section">
            <Calendar onDateChange = {setDateParse} />
            <Appointments date = {dateParse} />
        </section>
    )
}
export default Dates