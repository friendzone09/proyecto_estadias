function CancelHour({ appointObject }){
    return(
        <div className="cancel_hour show_hour">
            <span> {appointObject.hour}</span>
            <span> No disponible </span>
        </div>
    )
}

export default CancelHour