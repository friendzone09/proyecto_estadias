import { CircleAlert } from "lucide-react"
import './index.css'

function ConnectionError(){
    return(
        <div className="error conecction-error">
            <CircleAlert size={100} className="icon" />
            <h1>Se produjo un error al intentar conectar</h1>
            <span>Si el probmlea perciste, contacta con el <a href="#">soporte técnico</a> para solucionarlo</span>
            <a href="/" className="reset_button">Reintentar</a>
        </div>
    )
}

export default ConnectionError