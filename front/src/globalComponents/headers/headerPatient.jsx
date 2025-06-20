import LogOutButton from "../components/LogOutButton"
import { Link } from "react-router-dom"
function HeaderPatient({userType}){
    return(
        <>
            <div className="header_pages">
                <Link to={'/'}>Inicio</Link>
                { userType == null? <a href="/login">Inicia sesión</a> :  <LogOutButton/> }
            </div>

        </>
    )
}

export default HeaderPatient