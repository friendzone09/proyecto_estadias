import Calendar from "./Calendar"
import GlobalAppoints from '../../globalComponents/appoints/GlobalAppoints'
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";

import { getUser } from "../../utils/get_user";

function AppointAgend (){

    const navigate = useNavigate();
    const user = getUser();
    const userPsycho = user == null ? null : user.fk_psycho
    const { id_psycho } = useParams();
    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });

    console.log(user);

    useEffect(()=>{
        if(user == null || userPsycho != null){
            navigate('/')
        }
    }, [])

    if (user == null) {
        return null;
    }

    return (
        <section className="appointments_section">
            <Calendar onDateChange = {setDateParse} />
            <GlobalAppoints date = {dateParse} id_psycho={id_psycho} userType={user.type || null} />
        </section>
    )
}
export default AppointAgend

//ESTRUCTURA DE UN USUARIO PACIENTE

// user = {'user_id' : user_info[0], 
// 'name' : user_info[1], 
// 'last_name' : user_info[2], 
// 'email' : user_info[3],
// 'fk_psycho' : user_info[4], 
// 'type' : user_info[5]}