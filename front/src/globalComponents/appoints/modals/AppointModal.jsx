function AppointModal({ date, onClick, selectedAppoint, closeModal, user }){
    return(
        <>
        <h2>
            {user.asig_psycho == null?( 'Agendar una cita para: ' ):
            ( 'Pedir una cita para: ' )}{date.month} {date.day} - {date.year} 
        </h2>
        <h2>Hora:{selectedAppoint.hour}</h2>
        <div className="dialog_options">
            <span onClick={closeModal} className="close_button" >Cerrar</span>
            {user.asig_psycho == null &&(<button className="acept_button" onClick={onClick} >Agendar</button>)}
        </div>
        </>
    )
}

export default AppointModal