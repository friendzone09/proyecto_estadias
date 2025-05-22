import { getSchedule } from "../../../utils/getSchedule";
import { useEffect, useState, useRef } from "react"

import FreeHour from "./ListHours/FreeHour";
import AppointHour from "./ListHours/AppointHour";
import CancelHour from "./ListHours/CancelHour";
import CancelModal from "./modals/CancelModal";
import ActivateModal from "./modals/ActivateModal";

import { getPsychoId, getPsycho } from "../../../utils/get_user";
import { cancellAppoint } from "../../../utils/cancelAppoints";
import { activateAppoint } from "../../../utils/acivateAppoint";

function Appointments ({ date }){

    const id_psycho = getPsychoId()

    const [selectedAppoint, setSelectedAppoint] = useState(null);
    const dialogRef = useRef(null);

    const [psycho, setPsycho] = useState({name: '' , last_name : ''})
    const [schedule, setSchedule] = useState([])

    const openModal = (appoint) => {
        console.log(appoint)
        setSelectedAppoint(appoint);
        console.log(appoint)
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

    async function callCancelAppoint(hour_id) {
        const newDate = `${date.year}-${date.monthNum}-${date.day}`;

        const formData = new FormData()
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('hour_id', hour_id);

        await cancellAppoint(formData)

        closeModal();
        callGetSchedule();

    }

    async function callActivateAppoint(hour_id) {
        const newDate = `${date.year}-${date.monthNum}-${date.day}`;

        const formData = new FormData()
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('hour_id', hour_id);

        await activateAppoint(formData)

        closeModal();
        callGetSchedule();
    }

    async function callGetSchedule() {
            const newDate = `${date.year}-${date.monthNum}-${date.day}`;
            const formData = new FormData()
            formData.append('id', id_psycho);
            formData.append('date', newDate);

            const data = await getSchedule(formData)

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
       setPsycho(getPsycho());
    }, [])

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
                    a.status == true? (<AppointHour key={a.id} appointObject = {a} onClick={() => openModal(a)}/>):
                    ( <CancelHour key={a.id} appointObject = {a} onClick={() => openModal(a)} /> )
                 ))}

            </div>

            <dialog ref={dialogRef} className="modal">
                {selectedAppoint && (
                    selectedAppoint.status == null || selectedAppoint.status == true ?
                    <CancelModal date={date}
                        onClick={() => callCancelAppoint(selectedAppoint.id)}
                        selectedAppoint={selectedAppoint}
                        closeModal={closeModal} /> 
                    :
                    <ActivateModal date={date}
                        onClick={() => callActivateAppoint(selectedAppoint.id)}
                        selectedAppoint={selectedAppoint}
                        closeModal={closeModal} />
                )}
            </dialog>

        </div>
    )
}

export default Appointments