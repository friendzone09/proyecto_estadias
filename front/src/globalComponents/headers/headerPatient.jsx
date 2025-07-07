import LogOutButton from "../components/LogOutButton"
import { Link } from "react-router-dom"
function HeaderPatient({user}){
    return(
        <>
            <div className="header_pages">
                <Link to={'/'}>Inicio</Link>
                { user.role == null? <a href="/login">Inicia sesión</a> :  user.asig_psycho == null? (
                    <LogOutButton/>) : (
                        <>
                        <Link to={'/patient/psycho'}>Mi psicólogo</Link>
                        <LogOutButton/>
                        </>
                ) }
            </div>

        </>
    )
}

export default HeaderPatient