import { useUser } from "../../contexts/userContext/UserContext";
import PatientManual from "./Manuals/PatientManual";

function HowUse() {
    const { user } = useUser();

    console.log(user)

    if (!user) return null;

    return (
        <>
            {user.role == 'patient' || user.role == null && <PatientManual width={window.innerWidth}/>}
            {user.role == 'psycho' && (<span>Usted es un psicólogo</span>)}
            {user.role == 'admin' && (<span>Usted es un administrador</span>)}
        </>
    )
}

export default HowUse