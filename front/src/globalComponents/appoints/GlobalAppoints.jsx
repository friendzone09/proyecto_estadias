import { useToast } from "../../components/alert/ToastContext";
import { getSchedule } from "../../utils/getSchedule";
import { insertAppoint } from "../../utils/insertAppoint";
import { useEffect, useState, useRef } from "react"

import CancelModal from "./modals/CancelModal";
import ActivateModal from "./modals/ActivateModal";
import AppointModal from "./modals/AppointModal";

import { cancellAppoint } from "../../utils/cancelAppoints";
import { activateAppoint } from "../../utils/acivateAppoint";

import { getUser } from "../../utils/get_user";
import { reLoginUser } from "../../utils/loginUser";
import { getPsychoInfo } from "../../utils/get_user";

import PatientSchedule from "./MapSchedule/PatientSchedule";
import PsychoSchedule from "./MapSchedule/PsychoSchedule";

import './index.css'

function GlobalAppoints({ date, id_psycho, userType }) {

    const { addAlert } = useToast();

    const [psycho, setPsycho] = useState({ name: '', last_name: '' })
    const [schedule, setSchedule] = useState([])
    const [selectedAppoint, setSelectedAppoint] = useState(null);

    const dialogRef = useRef(null);

    //FUNCIONES GENERALES

    const openModal = (appoint) => {
        setSelectedAppoint(appoint);
        if (dialogRef.current) dialogRef.current.showModal();
    };

    const closeModal = () => {
        if (dialogRef.current) dialogRef.current.close();
        setSelectedAppoint(null);
    };

    async function callGetSchedule() {
        const newDate = `${date.year}-${date.monthNum}-${date.day}`;
        const formData = new FormData()
        formData.append('id', id_psycho);
        formData.append('date', newDate);

        const data = await getSchedule(id_psycho, newDate);

        if (selectedDate < today) {
            setSchedule([]);
            return null
        }
        if (data.schedule) {
            setSchedule(data.schedule)
        } else {
            setSchedule([]);
        }
    }

    function isPastDate() {
        if (date.day === "") return false;
        return selectedDate < today;
    };

    //FUNCIONES PARA PSICOLOGO Y ADMIN

    async function callCancelAppoint(hour_id) {
        const newDate = `${date.year}-${date.monthNum}-${date.day}`;
        const formData = new FormData();
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('hour_id', hour_id);

        const data = await cancellAppoint(formData);
        closeModal();
        addAlert(data.message, data.type);
        callGetSchedule();
    }

    async function callActivateAppoint(hour_id) {
        const newDate = `${date.year}-${date.monthNum}-${date.day}`;
        const formData = new FormData();
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('hour_id', hour_id);

        const data = await activateAppoint(formData);
        closeModal();
        await callGetSchedule();
        addAlert(data.message, data.type);
    }

    //FUNCIONES DE PACIENTE Y ADMIN

    async function agendAppoint(id_hour) {

        const newDate = `${date.year}-${date.monthNum}-${date.day}`;
        const user = getUser()
        const userId = user.user_id;

        const formData = new FormData()
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('patient_id', userId);
        formData.append('hour_id', id_hour);

        const data = await insertAppoint(formData);

        if (data.type == 'success') await reLoginUser(data.user)

        console.log(data)

        await callGetSchedule();
        addAlert(data.message, data.type)
        closeModal();
    }

    //VARIABLES

    const selectedDate = new Date(
        parseInt(date.year),
        parseInt(date.monthNum) - 1,
        parseInt(date.day)
    );

    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    //EFECTOS

    useEffect(() => { 
        if (date.day != '' && id_psycho > 0) {
            callGetSchedule();
        } else{
            setSchedule([]);
        }
    }, [date])

    useEffect(() => {
        async function getPsycho() {
            const data = await getPsychoInfo(id_psycho)
            setPsycho(data);
        }

        if (id_psycho > 0){
            getPsycho()
        } else{
            setPsycho({ name: '', last_name: '' })
        }
        
    }, [id_psycho])

    return (
        <div className="appointments">

            <small>Lic. {psycho.name} {psycho.last_name} </small>

            {date.day === "" ? (<h1>Seleccione una fecha</h1>) :
                isPastDate() ? (<h1>Día ya no disponible</h1>) :
                (<h1>{date.month} {date.day} - {date.year}</h1>)}

            {schedule.length === 0 && <p>Seleccione otra fecha</p>}

            <div className="schedule">
                {userType == 'patient' ? (<PatientSchedule schedule={schedule} openModal={openModal}/>) :
                userType == 'psycho' ? (<PsychoSchedule schedule={schedule} openModal={openModal}/>) :
                userType == 'admin' ? (<PatientSchedule schedule={schedule} openModal={openModal}/>) : (<p>No login</p>)}
            </div>

            <dialog ref={dialogRef} className="modal">
                {selectedAppoint && (

                    userType === 'patient' ? (
                        <AppointModal
                            date={date}
                            onClick={() => agendAppoint(selectedAppoint.id)}
                            selectedAppoint={selectedAppoint}
                            closeModal={closeModal}
                        />
                    ) : userType === 'psycho' ? (
                        selectedAppoint.status == null || selectedAppoint.status === true ? (
                            <CancelModal date={date}
                                onClick={() => callCancelAppoint(selectedAppoint.id)}
                                selectedAppoint={selectedAppoint}
                                closeModal={closeModal} />
                        ) : (
                            <ActivateModal date={date}
                                onClick={() => callActivateAppoint(selectedAppoint.id)}
                                selectedAppoint={selectedAppoint}
                                closeModal={closeModal} />
                        )
                    ) : userType === 'admin' ? (
                        <p>Modal para administrador</p>
                    ) : null

                )}
            </dialog>

        </div>
    )
}

export default GlobalAppoints