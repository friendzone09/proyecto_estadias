import LogOutButton from "../components/LogOutButton"
import { Link } from "react-router-dom"

function HeaderAdmin(){
    return(
        <div className="header_pages">
            <Link to={'/'}>Citas</Link>
            <Link to={'/admin/users'}>Usuarios</Link>
            <LogOutButton/>
        </div>
    )
}

export default HeaderAdmin