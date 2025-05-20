import Calendar from "./Calendar"
import Appointments from "./Appointments"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";

import './ListHours/index.css'
import { getUserPsycho, getUserType } from "../../utils/get_user";

function AppointAgend (){
    const navigate = useNavigate();

    useEffect(()=>{

        function canPass(){

            const userPsycho = getUserPsycho()
            const userType = getUserType()

            if(userType == null || userPsycho!= null){
                navigate('/')
            }

        }

        canPass();

    }, [])

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
