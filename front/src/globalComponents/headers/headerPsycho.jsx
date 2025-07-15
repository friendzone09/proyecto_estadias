import LogOutButton from "../components/LogOutButton"
import { useUser } from "../../contexts/userContext/UserContext";
import { Link } from "react-router-dom";

function HeaderPsycho(){
    const {user} = useUser();

    return(
        <>
            <div className="header_pages">
                <Link to={'/'}>Citas</Link>
                <Link to={'/my-patients'}>Mis pacientes</Link>
                <LogOutButton/>
            </div>

            <div className="pyscho_profile">
               <Link to={'/profile'}><img src={user.image} alt="" /> </Link>
            </div>
        </>
    )
}

export default HeaderPsycho