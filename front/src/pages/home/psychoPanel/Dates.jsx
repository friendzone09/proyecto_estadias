import Calendar from "./Calendar"
import GlobalApppoints from '../../../globalComponents/appoints/GlobalAppoints'
import { useState } from "react"

import './index.css'

function Dates ({ user }){

    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });

    return (
        <section className="appointments_section">
            <Calendar onDateChange = {setDateParse} />
            <GlobalApppoints date = {dateParse} user={user} id_psycho={user.id}/>
        </section>
    )
}
export default Dates

//ESTRUCUTRA DE UN USUARIO PSICOLOGO

//user = {'user_id' : user_info[0],
//        'name' : user_info[1],
//        'last_name' : user_info[2],
//        'email' : user_info[3],
//        'type' : user_info[6],
//        'image' : user_info[4]}