import logo from '../static/images/LOGO GHAMARIS.png';
import HeaderPsycho from './headers/headerPsycho';
import HeaderPatient from './headers/headerPatient';
import HeaderAdmin from './headers/HeaderAdmin';

function Header({ userType }){
    return(
        <header>
            
            <div className="logo_container">
                <img src={logo} alt="" />
                <p>Ghamaris psicología</p>
            </div>
       
            {userType === 'psycho' ? (<HeaderPsycho/>) : userType == 'admin' ? ( <HeaderAdmin/> ) : (<HeaderPatient userType = {userType} />) }
           
        </header>
    )
}

export default Header