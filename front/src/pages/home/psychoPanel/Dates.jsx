import Calendar from "./Calendar"
import GlobalApppoints from '../../../globalComponents/appoints/GlobalAppoints'
import { useState } from "react"

import { getUser } from "../../../utils/get_user"

import './index.css'

function Dates (){

    let user = getUser()

    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });

    return (
        <section className="appointments_section">
            <Calendar onDateChange = {setDateParse} />
            <GlobalApppoints date = {dateParse} id_psycho={user.user_id} userType={user.type}/>
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