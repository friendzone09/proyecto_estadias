function AppointHour({ appointObject, onClick, className}){
    return(
        <div className={`appoint_hour show_hour ${className}`} onClick={onClick}>
            <span> {appointObject.hour}</span>
            <span> Apartada </span>
        </div>
    )
}

export default AppointHour