import logo from '../static/images/LOGO GHAMARIS.png';
import HeaderPsycho from './headers/headerPsycho';
import HeaderPatient from './headers/headerPatient';
import HeaderAdmin from './headers/HeaderAdmin';
import { useUser } from '../contexts/userContext/UserContext';
import { Link } from 'react-router-dom';

function Header(){

    const {user} = useUser()

    if(!user) return null

    return(
        <header>
            
            <div className="logo_container">
                <Link to={'/'}>
                <img src={logo} alt="" />
                <p>Ghamaris psicología</p>
                </Link>
                
            </div>
       
            {user.role === 'psycho' ? (<HeaderPsycho user={user}/>) : user.role == 'admin' ? ( <HeaderAdmin/> ) : (<HeaderPatient userType = {user.role} />) }
           
        </header>
    )
}

export default Header