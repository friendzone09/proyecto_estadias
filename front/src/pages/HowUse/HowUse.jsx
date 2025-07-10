import { useUser } from "../../contexts/userContext/UserContext";

function HowUse(){
    const {user} = useUser();

    if(!user) return null;

    return(
        <>
        {user.role == 'patient' || user.role == null && ( <span>Usted es un paciente</span> )}
        {user.role == 'psycho' && ( <span>Usted es un psicólogo</span> )}
        {user.role == 'admin' && ( <span>Usted es un administrador</span> )}
        </>
    )
}

export default HowUse