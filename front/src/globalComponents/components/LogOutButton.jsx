import { logOut } from "../../utils/logOut";

function LogOutButton({ icon }){

    function callLogOut(e){
        e.preventDefault();
        logOut();
    }

    return(
        <a href="#" onClick={callLogOut}>Salir de la sesión {icon}</a>
    )
}

export default LogOutButton