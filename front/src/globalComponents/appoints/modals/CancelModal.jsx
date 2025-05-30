function CancelModal({ date, onClick, selectedAppoint, closeModal }){
    return(
        <>
            <h2>¿Suspender? {date.month} {date.day} - {date.year} </h2>
            <h2>Hora:{selectedAppoint.hour}</h2>
            <div className="dialog_options">
                <span onClick={closeModal} className="close_button" >Cerrar</span>
                <button className="cancel_button" onClick={onClick}>Suspender</button>
            </div>          
        </>
    )
}

export default CancelModal