import logo from '../static/images/LOGO GHAMARIS.png';
import HeaderPsycho from './headers/headerPsycho';
import HeaderPatient from './headers/headerPatient';
import HeaderAdmin from './headers/HeaderAdmin';
import { useUser } from '../contexts/userContext/UserContext';
import BurguerMenu from './headers/BurguerMenu';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';

function Header() {

    const { user } = useUser()
    const [menuOpen, setMenuOpen] = useState(false);

    if (!user) return null

    return (
        <header>

            <div className="logo_container">
                <Link to={'/'}>
                    <img src={logo} alt="" />
                    <p>Ghamaris psicología</p>
                </Link>

            </div>

            {user.role === 'psycho' ? (<HeaderPsycho user={user} />) : user.role == 'admin' ? (<HeaderAdmin />) : (<HeaderPatient userType={user.role} />)}

            <i className='header_menu'>
                <Menu size={30} onClick={() => setMenuOpen(!menuOpen)} />
            </i>

            {menuOpen && (
                <BurguerMenu user={user} isOpen={menuOpen} setMenuOpen={setMenuOpen}/>
            )}

        </header>
    )
}

export default Header