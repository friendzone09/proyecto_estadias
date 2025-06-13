import { useUser } from "../contexts/userContext/UserContext"
import { Mail, MapPinned, MessageSquareText } from "lucide-react"

function Footer(){

    const {user} = useUser()

    if(!user) return null

    return(
        <footer>
            <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=psicologiaghamaris@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            > <Mail/> Envia un correo </a>
            <a href="https://maps.app.goo.gl/dkJabJMrfmq7S8588"
            target="_blank"
            > <MapPinned/> Av Hidalgo 303-Primer piso interior 107, Centro, 90300 Cdad. de Apizaco, Tlax.</a>
            <a href="https://wa.me/2412231708?text=Hola,%20me%20gustaría%20información%20para%20una%20cita%20con%20ustedes"
            target="_blank"
            > <MessageSquareText /> Whatsapp</a>
        </footer>
    )
}

export default Footer

//Av Hidalgo 303-Primer piso interior 107, Centro, 90300 Cdad. de Apizaco, Tlax. |  241-223-17-08