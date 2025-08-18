import Calendar from "./Calendar"
import GlobalAppoints from '../../globalComponents/appoints/GlobalAppoints'
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext/UserContext";

function AppointAgend (){

    const navigate = useNavigate();
    const { id_psycho } = useParams();
    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });
    const { user, setUser } = useUser();

    if (!user) return null;

    return (
        <section className="appointments_section">
            <Calendar onDateChange = {setDateParse} />
            <GlobalAppoints date = {dateParse} id_psycho={id_psycho} user={user} />
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