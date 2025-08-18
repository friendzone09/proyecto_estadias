import FreeHour from "../ListHours/FreeHour"
import AppointHour from "../ListHours/AppointHour"
import CancelHour from "../ListHours/CancelHour"

function NullSchedule({ schedule}) {

    return (
        schedule.map(a => (
            a.status == null ? (<FreeHour appointObject={a} key={a.id}/>) :
            a.status == true ? (<AppointHour key={a.id} appointObject={a} className={''}/>) :
            (<CancelHour key={a.id} appointObject={a} className={''}/>)
        ))
    )
}

export default NullSchedule