import { useUser } from "../contexts/userContext/UserContext"
import { Link } from "react-router-dom"
import { Mail, MapPinned, MessageSquareText, BookOpen } from "lucide-react"

function Footer(){

    const {user} = useUser()

    if(!user) return null

    return(
        <footer>
            <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=psicologiaghamaris@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            > <Mail/> Enviar un correo </a>
            <a href="https://maps.app.goo.gl/dkJabJMrfmq7S8588"
            target="_blank"
            > <MapPinned/>¿Dónde nos encuentras?</a>
            <a href="https://wa.me/+522412231708"
            target="_blank"
            > <MessageSquareText /> Whatsapp</a>
            <Link to={'/how-use'}><BookOpen/> ¿Cómo se usa?</Link>
        </footer>
    )
}

export default Footer

//Av Hidalgo 303-Primer piso interior 107, Centro, 90300 Cdad. de Apizaco, Tlax. |  241-223-17-08