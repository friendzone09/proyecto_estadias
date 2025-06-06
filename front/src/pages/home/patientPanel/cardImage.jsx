import { getUser } from "../../../utils/get_user";

function CardImage ({image, psychoId, userType}){

    const imageUrl =  `http://127.0.0.1:5000/uploads/${image}` 
    const psychoLink = `/appointAgend/${psychoId}`;

    const user = getUser();

    console.log(user);

    let userPsycho = user == null? null : user.fk_psycho;

    return(
        <section className="psycho_image">
            <img src={imageUrl} alt="psycho_image" />

            <div className="psycho_button">
                {userPsycho != null && ( <span></span> )}
                {userType == null &&( <a href="/login">Inicia sesión</a>)}
                {userType == 'patient' && userPsycho == null &&( <a href={psychoLink} >Agendar una cita</a> )}
            </div>
        </section>
    )
}
export default CardImage