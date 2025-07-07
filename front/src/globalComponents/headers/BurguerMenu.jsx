import LogOutButton from "../components/LogOutButton"
import { Link } from "react-router-dom"
import { House, LogOut, User, NotepadText, LogIn, X, Brain } from "lucide-react"

function BurguerMenu({ user, isOpen, setMenuOpen }) {

    const handleClick = () => {
        setMenuOpen(false);
    }

    return (
        <div className={`burguer_menu ${isOpen ? 'open' : ''}`}>

            <X className="close_menu" onClick={handleClick}/>

            <div className="burguer_menu_links" onClick={handleClick}>

                {(user.role === 'psycho' || user.role === 'admin') &&
                    <Link to={'/'}>Citas <NotepadText /></Link>
                }

                {user.role === 'patient' &&
                    user.asig_psycho != null && (
                        <>
                        <Link to={'/'}>Inicio <House /></Link>
                        <Link to={'/patient/psycho'}>Mi psicólogo <Brain/></Link>
                        </>
                    ) 
                }

                {!user.role &&
                    <>
                        <Link to={'/'}>Inicio <House /></Link>
                        <Link to={'/login'}>Inicia sesión <LogIn /></Link>
                    </>
                }

                {user.role === 'admin' &&
                    <Link to={'/admin/users'}>Usuarios <User /></Link>
                }

                {user.role === 'psycho' &&
                    <Link to={'/profile'}>Perfil <User /></Link>
                }

                {user.role &&
                    <LogOutButton icon={<LogOut />} />
                }
            </div>
        </div>
    )
}

export default BurguerMenu;