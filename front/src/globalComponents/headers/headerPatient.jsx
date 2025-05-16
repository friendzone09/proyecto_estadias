import LogOutButton from "../components/LogOutButton"
function HeaderPatient({userType}){
    return(
        <>
            <div className="header_pages">
                <a href="/">Inicio</a>
                { userType == null? <a href="/login">Inicia sesión</a> :  <LogOutButton/> }
            </div>

        </>
    )
}

export default HeaderPatient