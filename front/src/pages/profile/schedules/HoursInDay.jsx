
function HoursInDay({hour, status, onToggle}){

    return(
        <div className="hour_in_day">

            <span> {hour} </span>

            <input type="checkbox" checked={status} onChange={onToggle} />

        </div>
    )
}

export default HoursInDay