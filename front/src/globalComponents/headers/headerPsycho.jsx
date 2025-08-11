import LogOutButton from "../components/LogOutButton"
import { useUser } from "../../contexts/userContext/UserContext";
import { Link } from "react-router-dom";

function HeaderPsycho(){
    const {user} = useUser();

    const defaultImage = 'https://pdynrtpvyegijbsstwai.supabase.co/storage/v1/object/public/profile-images//default.webp'

    return(
        <>
            <div className="header_pages">
                <Link to={'/'}>Citas</Link>
                <Link to={'/my-patients'}>Mis pacientes</Link>
                <LogOutButton/>
            </div>

            <div className="pyscho_profile">
                <Link to={'/profile'}><img src={user.image || defaultImage} alt="" onError={(e) => { e.target.src = defaultImage }}/> </Link>
            </div>
        </>
    )
}

export default HeaderPsycho