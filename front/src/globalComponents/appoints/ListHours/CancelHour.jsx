function CancelHour({ appointObject, onClick, className }){
    return(
        <div className={`show_hour cancel_hour ${className}`} onClick={onClick}>
            <span> {appointObject.hour}</span>
            <span> No disponible </span>
        </div>
    )
}

export default CancelHour