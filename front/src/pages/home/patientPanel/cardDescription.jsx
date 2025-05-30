import { getUser } from "../../../utils/get_user";

function CardDescription({description, userType, psychoId}){

    const user = getUser();
    let userPsycho = user == null? null : user.fk_psycho

    const psychoLink = `/appointAgend/${psychoId}`;

    return(
        <section className="card_description">

            <div className="psycho_decription">

                <h1>Descripción</h1>

                <p>{description}</p>

            </div>

            <div className="psycho_button">
                {userPsycho != null && ( <a href="#"> Ya no puedes agendar mas citas </a> )}
                {userType == null &&( <a href="/login">Si quieres agendar una cita primero inicia sesión</a>)}
                {userType == 'patient' && userPsycho == null &&( <a href={psychoLink} >Agendar una cita</a> )}
            </div>
        </section>
    )
}

export default CardDescription