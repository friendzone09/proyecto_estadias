import { data } from "react-router-dom";
import { getSchedule } from "../../utils/getSchedule";
import { insertAppoint } from "../../utils/insertAppoint";
import { useEffect, useState, useRef } from "react"

import FreeHour from "./ListHours/FreeHour";
import AppointHour from "./ListHours/AppointHour";
import CancelHour from "./ListHours/CancelHour";

import { getPatienId } from "../../utils/get_user";
import { reLoginUser } from "../../utils/loginUser";

function Appointments ({ date, id_psycho }){

    const [selectedAppoint, setSelectedAppoint] = useState(null);
    const dialogRef = useRef(null);

    const [psycho, setPsycho] = useState({name: '' , last_name : ''})
    const [schedule, setSchedule] = useState([])

    const openModal = (appoint) => {
        setSelectedAppoint(appoint);
        if (dialogRef.current) dialogRef.current.showModal();
    };

    const closeModal = () => {
        if (dialogRef.current) dialogRef.current.close();
        setSelectedAppoint(null);
    };

    const selectedDate = new Date(
            parseInt(date.year),
            parseInt(date.monthNum) - 1,
            parseInt(date.day)
    );

    async function callGetSchedule() {

            const newDate = `${date.year}-${date.monthNum}-${date.day}`;
            
            const formData = new FormData()
            formData.append('id', id_psycho);
            formData.append('date', newDate);

            const data = await getSchedule(formData);

            if(selectedDate < today){
                setSchedule([]);
                return null
            }

            if(data.schedule){
                setSchedule(data.schedule)
            } else{
                setSchedule([]);
            }
        }

    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    function isPastDate(){
        if (date.day === "") return false;

        return selectedDate < today;
    };

    useEffect(()=>{

        if(date.day != ''){
            callGetSchedule();
        }

    }, [date])

    useEffect(()=>{
        async function getPsycho() {

            const formData = new FormData();
            formData.append('id',id_psycho)

            const response = await fetch('http://127.0.0.1:5000/get_psycho',{
                method : 'POST',
                body : formData
            });

            if(!response.ok){
                console.log('Salio mal')
            } 

            const data = await response.json()

            setPsycho(data)

        }

        getPsycho()
    }, [])

    async function agendAppoint(id_hour){ 

        const newDate = `${date.year}-${date.monthNum}-${date.day}`;
        const userId = getPatienId()
            
        const formData = new FormData()
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('patient_id', userId);
        formData.append('hour_id', id_hour);

        await insertAppoint(formData);
        await reLoginUser(userId)
        closeModal();
        callGetSchedule();

    }

    return (
        <div className="appointments">

            <small>Lic. {psycho.name} {psycho.last_name} </small>

            {date.day === "" ? (<h1>Seleccione una fecha</h1>): 
            isPastDate() ? (<h1>Día ya no disponible</h1>):
            (<h1>{date.month} {date.day} - {date.year}</h1>)}

            {schedule.length === 0 && <p>Seleccione otra fecha</p>}

            <div className="schedule">

                

                {schedule.map(a =>( 
                    a.status == null ? ( <FreeHour appointObject={a} key={a.id}  onClick={() => openModal(a)} /> ): 
                    a.status == true? (<AppointHour key={a.id} appointObject = {a} />):
                    ( <CancelHour key = {a.id} appointObject = {a} /> )
                 ))}

            </div>

            <dialog ref={dialogRef} className="modal">
                {selectedAppoint && (
                <>
                    <h2>Agendar una cita para: {date.month} {date.day} - {date.year} </h2>
                    <h2>Hora:{selectedAppoint.hour}</h2>
                    <div className="dialog_options">
                        <span onClick={closeModal} className="close_button" >Cerrar</span>
                        <button className="acept_button" onClick={() => agendAppoint(selectedAppoint.id)} >Agendar</button>
                    </div>
                    
                </>
                )}
            </dialog>

        </div>
    )
}

export default Appointments