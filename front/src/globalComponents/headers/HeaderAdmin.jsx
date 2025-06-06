import LogOutButton from "../components/LogOutButton"

function HeaderAdmin(){
    return(
        <div className="header_pages">
            <a href="/">Inicio</a>
            <span>Nuevo usuario</span>
            <LogOutButton/>
        </div>
    )
}

export default HeaderAdmin