import { useToast } from "../../contexts/alert/ToastContext";
import { getSchedule } from "../../utils/getSchedule";
import { insertAppoint } from "../../utils/insertAppoint";
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";

import CancelModal from "./modals/CancelModal";
import ActivateModal from "./modals/ActivateModal";
import AppointModal from "./modals/AppointModal";
import NewAppointModal from "./modals/NewAppointModal";

import { cancellAppoint } from "../../utils/cancelAppoints";
import { activateAppoint } from "../../utils/acivateAppoint";

import { getPsychoInfo } from "../../utils/get_user";

import PatientSchedule from "./MapSchedule/PatientSchedule";
import PsychoSchedule from "./MapSchedule/PsychoSchedule";

import './index.css'

function GlobalAppoints({ date, id_psycho, user }) {

    const { addAlert } = useToast();
    const navigate = useNavigate();

    const [psycho, setPsycho] = useState({ name: '', last_name: '' })
    const [schedule, setSchedule] = useState([])
    const [selectedAppoint, setSelectedAppoint] = useState(null);
    const [showAppointModal, setShowAppointModal] = useState(false);

    const dialogRef = useRef(null);

    //FUNCIONES GENERALES

    const openModal = (appoint) => {
        setSelectedAppoint(appoint);
        if (dialogRef.current) dialogRef.current.showModal();
    };

    const closeModal = () => {
        if (dialogRef.current) dialogRef.current.close();
        setSelectedAppoint(null);
        setShowAppointModal(false)
    };

    async function callGetSchedule() {
        const newDate = `${date.year}-${date.monthNum}-${date.day}`;
        const formData = new FormData()
        formData.append('id', id_psycho);
        formData.append('date', newDate);

        const data = await getSchedule(id_psycho, newDate);

        console.log(data);

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

     const openAppointFromCancel = () => {
        setShowAppointModal(true);
    };


    //FUNCIONES AGENDAR CITA

    async function agendAppoint(id_hour, userId = user.id ) {

        const newDate = `${date.year}-${date.monthNum}-${date.day}`;

        const formData = new FormData()
        formData.append('user_type', user.role )
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('patient_id', userId);
        formData.append('hour_id', id_hour);

        const data = await insertAppoint(formData);

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
    }, [date, id_psycho])

    useEffect(() => {
        async function getPsycho() {
            const data = await getPsychoInfo(id_psycho)

            if (data.type == 'error') {navigate('/')}

            setPsycho(data.psycho);
        }
        if (id_psycho > 0){
            getPsycho()
        } else{
            setPsycho({ name: '', last_name: '' })
        }
        
    }, [id_psycho])

    return (
        <div className="appointments">

            {psycho.name == ''? 
            (<small>Seleccione un psicólogo</small>): 
            (<small>Lic. {psycho.name} {psycho.last_name}</small>)
            }

            {date.day === "" ? (<h1>Seleccione una fecha</h1>) :
                isPastDate() ? (<h1>Día ya no disponible</h1>) :
                (<h1>{date.month} {date.day} - {date.year}</h1>)}

            {schedule.length === 0 && <p>Seleccione otra fecha</p>}

            <div className="schedule">
                {user.role == 'patient' ? (<PatientSchedule schedule={schedule} openModal={openModal}/>) :
                user.role == 'psycho' ? (<PsychoSchedule schedule={schedule} openModal={openModal}/>) :
                user.role == 'admin' ? (<PsychoSchedule schedule={schedule} openModal={openModal}/>) : (<p>No login</p>)}
            </div>

            <dialog ref={dialogRef} className="modal">
                {selectedAppoint && (
                showAppointModal ? (
                    <NewAppointModal
                        date={date}
                        onClick={(hourId, patientId) => agendAppoint(hourId, patientId)}
                        selectedAppoint={selectedAppoint}
                        PsychoId = {id_psycho}
                        closeModal={() => {
                            closeModal();
                            setShowAppointModal(false);
                        }}
                    />
                ) :  
                user.role === 'patient' ? (
                    <AppointModal
                        date={date}
                        onClick={() => agendAppoint(selectedAppoint.id)}
                        selectedAppoint={selectedAppoint}
                        closeModal={closeModal}
                    />
                ) : user.role !== 'patient' ? (
                    selectedAppoint.status == null || selectedAppoint.status === true ? (
                        <CancelModal
                            date={date}
                            onClick={() => callCancelAppoint(selectedAppoint.id)}
                            selectedAppoint={selectedAppoint}
                            closeModal={closeModal}
                            openAppointFromCancel={openAppointFromCancel}
                        />
                    ) : (
                        <ActivateModal
                            date={date}
                            onClick={() => callActivateAppoint(selectedAppoint.id)}
                            selectedAppoint={selectedAppoint}
                            closeModal={closeModal}
                        />
                    )
                ): null
            )}
            </dialog>

        </div>
    )
}

export default GlobalAppoints