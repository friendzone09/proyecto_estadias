import logo from '../static/images/LOGO QR.jpeg';
import HeaderPsycho from './headers/headerPsycho';
import HeaderPatient from './headers/headerPatient';

function Header({ userType }){
    return(
        <header>
            
            <div className="logo_container">
                <img src={logo} alt="" />
                <p>LOGO</p>
            </div>
       
            {userType === 'psycho' ? <HeaderPsycho/> : <HeaderPatient userType = {userType} /> }
           
        </header>
    )
}

export default Header