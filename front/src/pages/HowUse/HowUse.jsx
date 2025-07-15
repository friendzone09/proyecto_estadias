import { useUser } from "../../contexts/userContext/UserContext";
import PatientManual from "./Manuals/PatientManual";
import PsychoManual from "./Manuals/PsychoManual";
import "./index.css"

function HowUse() {
    const { user } = useUser();

    console.log(user)

    if (!user) return null;

    return (
        <section className="user_manual">
            <h1 className="user_manuel--title">
                Bienvenido al manual de usuario para {
                    (user.role === 'patient' || user.role === null) && 'pacientes'
                }
                {user.role === 'psycho' && 'psicólogos'}
                {user.role === 'admin' && 'recepcionistas'}
            </h1>

            {(user.role === 'patient' || user.role === null) && <PatientManual width={window.innerWidth} />}
            {user.role == 'psycho' && <PsychoManual width={window.innerWidth} />}
            {user.role == 'admin' && (<span>Usted es un administrador</span>)}

            <p>Si tienes alguna duda, siempre puedes regresar aquí cuando quieras.</p>
        </section>
    )
}

export default HowUse