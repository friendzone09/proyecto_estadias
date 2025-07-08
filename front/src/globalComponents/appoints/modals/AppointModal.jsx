import { MessageCircle } from "lucide-react"

function AppointModal({ date, onClick, selectedAppoint, closeModal, user, info }) {

    return (
        <>
            <h2>
                {user.asig_psycho == null ? ('Agendar una cita para: ') :
                    ('Pedir una cita para: ')}{date.month} {date.day} - {date.year}
            </h2>
            <h2>Hora:{selectedAppoint.hour}</h2>
            
            {user.asig_psycho != null && ( <span>Envie un mensaje para agendar su siguiente cita: </span> )}

            <div className="dialog_options">
                <span onClick={closeModal} className="close_button" >Cerrar</span>
                {user.asig_psycho == null ? 
                (<button className="acept_button" onClick={onClick} >Agendar</button>):
                (<>
                <a className="message_button" href=
                {`https://wa.me/+522412231708?text=Hola,%20soy%20${info.patientName},%20me%20gustar%C3%ADa%20agendar%20una%20cita%20para%20el%20d%C3%ADa%20${date.day}%20de%20${date.month}%20a%20la%20hora%20${selectedAppoint.hour}%20con%20el/la%20psicólog@%20${info.psychoName}`}
                target="_blank" rel="noopener noreferrer">
                    Recepción <MessageCircle size={15}/>
                </a>
                <a className="message_button" href=
                {`https://wa.me/+52${info.psychoPhone}?text=Hola,%20soy%20${info.patientName},%20me%20gustar%C3%ADa%20agendar%20una%20cita%20para%20el%20d%C3%ADa%20${date.day}%20de%20${date.month}%20a%20la%20hora%20${selectedAppoint.hour}%20con%20usted`} 
                target="_blank" rel="noopener noreferrer">
                    Picólogo <MessageCircle size={15}/>
                </a>
                </>
                )
                }
            </div>
        </>
    )
}

export default AppointModal