function CancelModal({ date, onClick, selectedAppoint, closeModal, openAppointFromCancel}){

    return(
        <>
            <span className="appoint_date">{selectedAppoint.status == null ? ('Acciones para el día') : ('¿Suspender?')}  {date.day} de {date.month} del {date.year} </span>
            <span className="appoint_date">Hora: {selectedAppoint.hour}</span>

            {selectedAppoint.name && (<span> Paciente: {selectedAppoint.name} {selectedAppoint.last_name} </span>)}
            {selectedAppoint.appoint_type && (
                <span>
                Tipo de consulta: {selectedAppoint.appoint_type == 'single' && ('Individual')} {selectedAppoint.appoint_type == 'couple' && ('Pareja')} {selectedAppoint.appoint_type == 'family' && ('Familiar')}
                </span>
            )}
            
            <div className="dialog_options">
                <span onClick={closeModal} className="close_button" >Cerrar</span>
                <button className="cancel_button" onClick={onClick}>Suspender</button>
                {selectedAppoint.status == null && (
                    <span className="acept_button" onClick={openAppointFromCancel}>Agendar una cita</span>
                )}
            </div>          
        </>
    )
}

export default CancelModal