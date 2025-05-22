function CancelHour({ appointObject, onClick }){
    return(
        <div className="cancel_hour show_hour cancel_hour_psycho" onClick={onClick}>
            <span> {appointObject.hour}</span>
            <span> No disponible </span>
        </div>
    )
}

export default CancelHour