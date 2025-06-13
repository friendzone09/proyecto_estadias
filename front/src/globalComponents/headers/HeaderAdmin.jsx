import LogOutButton from "../components/LogOutButton"
import { Link } from "react-router-dom"

function HeaderAdmin(){
    return(
        <div className="header_pages">
            <Link to={'/'}>Inicio</Link>
            <Link to={'/newUser'}>Nuevo usuario</Link>
            <LogOutButton/>
        </div>
    )
}

export default HeaderAdmin