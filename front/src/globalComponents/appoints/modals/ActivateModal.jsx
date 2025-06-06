function ActivateModal({ date, onClick, selectedAppoint, closeModal }){
    return(
        <>
            <span className="appoint_date">¿Activar? {date.day} de {date.month} del {date.year} </span>
            <span className="appoint_date">Hora: {selectedAppoint.hour}</span>
            <div className="dialog_options">
                <span onClick={closeModal} className="close_button" >Cerrar</span>
                <button className="acept_button" onClick={onClick}>Activar</button>
            </div>          
        </>
    )
}

export default ActivateModal