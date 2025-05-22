

function DayInSchedule({ dayName, dayStatus, onToggleDay   }){

    return(
        <>

            <span> {dayName} </span>

            <input type="checkbox" checked={dayStatus} onChange={onToggleDay} />

        </>
    )
}

export default DayInSchedule