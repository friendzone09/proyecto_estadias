function AppointHour({ appointObject, onClick }){
    return(
        <div className="appoint_hour show_hour appoint_hour_for_psycho" onClick={onClick}>
            <span> {appointObject.hour}</span>
            <span> Apartada </span>
        </div>
    )
}

export default AppointHour