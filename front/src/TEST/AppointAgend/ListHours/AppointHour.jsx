function AppointHour({ appointObject }){
    return(
        <div className="appoint_hour show_hour">
            <span> {appointObject.hour}</span>
            <span> Apartada </span>
        </div>
    )
}

export default AppointHour