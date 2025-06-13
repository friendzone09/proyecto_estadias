import LogOutButton from "../components/LogOutButton"
import { useUser } from "../../contexts/userContext/UserContext";
import { Link } from "react-router-dom";

function HeaderPsycho(){

    const {user} = useUser();

    const psychoImage = `http://127.0.0.1:5000/uploads/${user.image}`

    return(
        <>
            <div className="header_pages">
                <Link to={'/'}>Citas</Link>
                <LogOutButton/>
            </div>

            <div className="pyscho_profile">
               <Link to={'/profile'}><img src={psychoImage} alt="" /> </Link>
            </div>
        </>
    )
}

export default HeaderPsycho