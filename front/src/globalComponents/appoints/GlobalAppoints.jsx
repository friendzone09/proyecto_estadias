import { useToast } from "../../contexts/alert/ToastContext";
import { getSchedule } from "../../utils/getSchedule";
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { useUser } from "../../contexts/userContext/UserContext";

import CancelModal from "./modals/CancelModal";
import ActivateModal from "./modals/ActivateModal";
import AppointModal from "./modals/AppointModal";
import NewAppointModal from "./modals/NewAppointModal";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";

import { getPsychoInfo } from "../../utils/get_user";

import PatientSchedule from "./MapSchedule/PatientSchedule";
import PsychoSchedule from "./MapSchedule/PsychoSchedule";

import './index.css'

function GlobalAppoints({ date, id_psycho, info = null }) {

    const API_URL = import.meta.env.VITE_API_URL

    const { addAlert } = useToast();
    const {user, setUser} = useUser();
    const navigate = useNavigate();

    const [psycho, setPsycho] = useState({ name: '', last_name: '' })
    const [schedule, setSchedule] = useState([])
    const [selectedAppoint, setSelectedAppoint] = useState(null);
    const [showAppointModal, setShowAppointModal] = useState(false);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        const newDate = `${date.year}-${date.monthNum}-${date.day}`;
        const formData = new FormData();
        formData.append('id', id_psycho);
        formData.append('date', newDate);

        const data = await getSchedule(id_psycho, newDate);

        if (selectedDate < today) {
            setSchedule([]);
            setLoading(false);
            return null
        }
        if (data.schedule) {
            setLoading(false);
            setSchedule(data.schedule)
        } else {
            setLoading(false);
            setSchedule([]);
        }
    }

    function isPastDate() {
        if (date.day === "") return false;
        return selectedDate < today;
    };

    //FUNCIONES PARA PSICOLOGO Y ADMIN

    async function callCancelAppoint(hour_id) {
        setLoading(true)

        const newDate = `${date.year}-${date.monthNum}-${date.day}`;
        const formData = new FormData();
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('hour_id', hour_id);

        closeModal();

        const res = await fetchWithAuth(`${API_URL}/cancel_appoint`, {method: 'POST', body: formData}); 
        const data = await res.json();
        addAlert(data.message, data.type);
        await callGetSchedule();

        setLoading(false);
    }

    async function callActivateAppoint(hour_id) {
        setLoading(true)

        const newDate = `${date.year}-${date.monthNum}-${date.day}`;
        const formData = new FormData();
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('hour_id', hour_id);

        closeModal();

        const res = await fetchWithAuth(`${API_URL}/activate_appoint`, {method: 'POST', body: formData});
        const data = await res.json();
        addAlert(data.message, data.type);
        await callGetSchedule();

        setLoading(false)
    }

    const openAppointFromCancel = () => {
        setShowAppointModal(true);
    };
    //FUNCION AGENDAR CITA
    async function agendAppoint(id_hour, userId = user.id) {
        setLoading(true);

        const newDate = `${date.year}-${date.monthNum}-${date.day}`;

        const formData = new FormData()
        formData.append('user_type', user.role)
        formData.append('psycho_id', id_psycho);
        formData.append('date', newDate);
        formData.append('patient_id', userId);
        formData.append('hour_id', id_hour);

        closeModal();

        const res = await fetchWithAuth(`${API_URL}/insert_appoint`, {method : 'POST', body: formData});
        const data = await res.json();
        addAlert(data.message, data.type);

        if(user.role == 'patient'){
            const resUser = await fetchWithAuth(`${API_URL}/get_all_user_info`);
            const dataUser = await resUser.json();
            setUser(dataUser.user);
        }
        
        await callGetSchedule();

        setLoading(false)
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
        } else {
            setSchedule([]);
        }
    }, [date, id_psycho]);

    useEffect(() => {
        async function getPsycho() {
            const data = await getPsychoInfo(id_psycho)
            if (data.type == 'error') { navigate('/') }
            setPsycho(data.psycho);
        }
        if (id_psycho > 0) {
            getPsycho()
        } else {
            setPsycho({ name: '', last_name: '' })
        }
    }, [id_psycho])

    return (
        <div className="appointments">

            {psycho.name == '' ?
                (<small></small>) :
                (<small>Lic. {psycho.name} {psycho.last_name}</small>)
            }

            {date.day === "" ? (<h1>Seleccione otra fecha</h1>) :
                isPastDate() ? (<h1>Día ya no disponible</h1>) :
                    (<h1>{date.month} {date.day} - {date.year}</h1>)}

            {(schedule.length === 0 && psycho.name == '') ? (<p>Seleccione un psicologo</p>): 
            (schedule.length === 0 && psycho !== '') && (<p>Seleccione una fecha</p>)}
            
            <div className="schedule">
                {loading ? (
                    <LoadingCircle/>
                ) : (
                    user.role == 'patient' ? (
                        <PatientSchedule schedule={schedule} openModal={openModal} />
                    ) : user.role == 'psycho' || user.role == 'admin' ? (
                        <PsychoSchedule schedule={schedule} openModal={openModal} />
                    ) : (
                        <p>No login</p>
                    )
                )}
            </div>

            <dialog ref={dialogRef} className="modal">
                {selectedAppoint && (
                    showAppointModal ? (
                        <NewAppointModal
                            date={date}
                            onClick={(hourId, patientId) => agendAppoint(hourId, patientId)}
                            selectedAppoint={selectedAppoint}
                            PsychoId={id_psycho}
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
                                user={user}
                                info={info}
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
                        ) : null
                )}
            </dialog>

        </div>
    )
}

export default GlobalAppoints