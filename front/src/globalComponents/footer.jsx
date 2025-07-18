import { useUser } from "../contexts/userContext/UserContext"
import { Link } from "react-router-dom"
import { Mail, MapPinned, MessageSquareText, BookOpen} from "lucide-react"
import { AiFillTikTok } from "react-icons/ai";
import { FaSquareFacebook, FaInstagram } from "react-icons/fa6";

function Footer() {

    const { user } = useUser()

    if (!user) return null

    return (
        <footer>

            <div>
                <span>Contactanos</span>
                <div className="footer--links">
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=psicologiaghamaris@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    > <Mail /> Enviar un correo </a>

                    <a href="https://wa.me/+522412231708"
                        target="_blank"
                    > <MessageSquareText /> Whatsapp</a>
                </div>
            </div>

            <div>
                <span>Direccion</span>
                <div className="footer--links">
                    <a href="https://maps.app.goo.gl/dkJabJMrfmq7S8588"
                        target="_blank"
                    > <MapPinned />¿Dónde nos encuentras?</a>
                </div>
            </div>

            <div>
                <span>Manual</span>
                <div className="footer--links">
                    <Link to={'/how-use'}><BookOpen /> ¿Cómo se usa?</Link>
                </div>
            </div>

            <div>
                <span>Nuestras redes</span>
                <div className="footer--social">
                    <a href="https://www.facebook.com/share/1EkDtyfwba/"><FaSquareFacebook size={40}/></a>
                    <a href="https://www.instagram.com/psicologiaghamaris?igsh=MXBjZGtuMnBxOXJjaw=="><FaInstagram size={40} /></a>
                    <a href="https://www.tiktok.com/@psicologia_ghamaris?_t=ZS-8y7ILXErtqy&_r=1"><AiFillTikTok size={40}/></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer

//Av Hidalgo 303-Primer piso interior 107, Centro, 90300 Cdad. de Apizaco, Tlax. |  241-223-17-08