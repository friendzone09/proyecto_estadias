import { useState } from 'react';
import Calendar from './Calendar';
import GlobalAppoints from '../../../globalComponents/appoints/GlobalAppoints';
import { useUser } from '../../../contexts/userContext/UserContext';

import './index.css'

function AdminHouse( ){

    const {user} = useUser()
    const [dateParse, setDateParse] = useState({ day: '', month: '', year: '', monthNum: '' });
    const [selectedPsychoId, setSelectedPsychoId] = useState(0);

    if (!user) return null

    return (
        <>

            <section className="appointments_section">
                <Calendar onDateChange = {setDateParse} onSelectPsycho={setSelectedPsychoId}/>
                <GlobalAppoints date = {dateParse} id_psycho={selectedPsychoId} user={user}/>
            </section>

        </>
    )
}

export default AdminHouse

//ESTRUCTURA DE UN USUARIO PSICOLOGO
//user = {
// 'user_id' : user_info[0],
// 'name' : user_info[1], 
// 'last_name' : user_info[2], 
// 'email' : user_info[3],
// 'type' : user_info[5]}