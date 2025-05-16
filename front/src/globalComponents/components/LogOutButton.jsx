import { logOut } from "../../utils/logOut";

function LogOutButton(){

    function callLogOut(e){
        e.preventDefault();
        logOut();
    }

    return(
        <a href="#" onClick={callLogOut}>Salir de la sesión</a>
    )
}

export default LogOutButton