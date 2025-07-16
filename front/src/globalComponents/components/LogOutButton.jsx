import { logOut } from "../../utils/logOut";
import { useLoading } from "../../contexts/loading/LoadingContext";

function LogOutButton({ icon }){
    const { setLoading } = useLoading(); 
    function callLogOut(e){
        e.preventDefault();
        setLoading(true)
        logOut();
        return null;
    }

    return(
        <a href="#" onClick={callLogOut}>Salir de la sesión {icon}</a>
    )
}

export default LogOutButton