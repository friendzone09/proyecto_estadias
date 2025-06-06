function AppointModal({ date, onClick, selectedAppoint, closeModal }){
    return(
        <>


        <h2>Agendar una cita para: {date.month} {date.day} - {date.year} </h2>
        <h2>Hora:{selectedAppoint.hour}</h2>
        <div className="dialog_options">
            <span onClick={closeModal} className="close_button" >Cerrar</span>
            <button className="acept_button" onClick={onClick} >Agendar</button>
        </div>
        </>
    )
}

export default AppointModal