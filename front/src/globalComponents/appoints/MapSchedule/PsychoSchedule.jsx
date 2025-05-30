import FreeHour from "../ListHours/FreeHour"
import AppointHour from "../ListHours/AppointHour"
import CancelHour from "../ListHours/CancelHour"

function PsychoSchedule({ schedule, openModal}) {

    return (
        schedule.map(a => (
            a.status == null ? (
                <FreeHour key={a.id} appointObject={a} onClick={() => openModal(a)} />): a.status === true ? 
                (<AppointHour key={a.id} appointObject={a} onClick={() => openModal(a)} className={'appoint_hour_for_psycho '}/>):
                (<CancelHour key={a.id} appointObject={a} onClick={() => openModal(a)} className={'cancel_hour_psycho'}/>)
        ))
    )
}

export default PsychoSchedule