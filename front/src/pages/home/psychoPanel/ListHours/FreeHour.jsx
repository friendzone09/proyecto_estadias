function FreeHour({ appointObject, onClick }){
    return(
        <div className="free_hour show_hour" onClick={onClick}>
            <span> {appointObject.hour}</span>
            <span> Libre </span>
        </div>
    )
}

export default FreeHour