import { Link } from "react-router-dom";
function CardImage({ image, psychoId, user }) {
    const psychoLink = `/appointAgend/${psychoId}`;

    return (
        <section className="psycho_image">
            <img src={image} alt="psycho_image" />

            <div className="psycho_button">
               {user.role == null && <Link to={psychoLink}>Ver horarios</Link>}
                {user.role == 'patient' && user.asig_psycho == null && (<Link to={psychoLink}>Agendar una cita</Link>)}
            </div>
        </section>
    )
}
export default CardImage