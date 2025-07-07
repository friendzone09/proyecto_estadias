import { useState, useEffect } from "react";

function NewAppointModal({ date, onClick, selectedAppoint, closeModal, PsychoId }){
    const [patients, setPatienst] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL

    async function getPatients(){
        const response = await fetch(`${API_URL}/get_patients/${PsychoId}`,{
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        setPatienst(data);
    }

    useEffect(()=>{
        async function callPatinets(){
            getPatients();
        }

        callPatinets()
    }, []);


    return(
        <section className="new_appoint_modal_psycho">
            <span className="appoint_date">Agendar una cita para el {date.day} de {date.month} del {date.year} </span>
            <span className="appoint_date"> Hora: {selectedAppoint.hour} </span>

           <select onChange={(e) => setSelectedPatientId(e.target.value)}>
                <option defaultValue={0}>Elige un paciente</option>
                {patients.map(p => (
                    <option key={p.id_patient} value={p.id_patient}>
                        {p.name} {p.last_name}
                    </option>
                ))}
            </select>

            <div className="dialog_options">
                <span onClick={closeModal} className="close_button">Cerrar</span>
                <button onClick={() => {
                    if (selectedPatientId > 0) {onClick(selectedAppoint.id, selectedPatientId);} 
                    else {alert("Selecciona un paciente");}
                }}  
                className="acept_button" >Agendar</button>
            </div>

            
        </section>
    )

}
export default NewAppointModal
//PARA AGENDAR UNA CITA NECESITO:
//id_hora, fecha, id_patien, id_psycho