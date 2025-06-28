import LogOutButton from "../components/LogOutButton"
import { Link } from "react-router-dom"
import { House, LogOut, User, NotepadText, LogIn } from "lucide-react"

function BurguerMenu( { user } ) {
    return (
        <div className="burguer_menu">

            <div className="burguer_menu_links">
                {user.role === 'psycho' || user.role === 'admin' ? 
                <Link to={'/'}>Citas <NotepadText/> </Link> : user.role == 'patient' ? 
                 <Link to={'/'}>Inicio <House/></Link> : 
                 <>
                 <Link to={'/'}>Incio <House/> </Link>
                 <Link to={'/login'}>Inicia sesión <LogIn/> </Link>
                 </>
                   }

                {user.role === 'admin' &&(<Link to={'/admin/users'}>Usuarios <User/></Link>)}
                {user.role === 'psycho' && <Link to={'/profile'}>Perfil <User/></Link>}


                {user.role !== null && (<LogOutButton icon={<LogOut/>} ></LogOutButton>)}
            </div>

        </div>
    )
}

export default BurguerMenu