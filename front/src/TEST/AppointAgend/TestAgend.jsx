import Calendar from "./Calendar"
import GlobalAppoints from "../../globalComponents/appoints/GlobalAppoints";
import { useState } from "react"

import './ListHours/index.css'

function TestAgend (){


    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });

    return (
        <section className="appointments_section">
            <Calendar onDateChange = {setDateParse} />
            <GlobalAppoints date = {dateParse} id_psycho={1} userType={'psycho'}/>
        </section>
    )
}
export default TestAgend

// Parametros que necesito enviar a GlobalAppoints
// *date *id_psycho(obligatorio) *userType(obligatorio)