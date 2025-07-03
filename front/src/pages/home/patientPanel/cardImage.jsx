import { Link } from "react-router-dom";
function CardImage({ image, psychoId, user }) {

    const API_URL = import.meta.env.VITE_API_URL

    const imageUrl = `${API_URL}/uploads/${image}`
    const psychoLink = `/appointAgend/${psychoId}`;

    return (
        <section className="psycho_image">
            <img src={imageUrl} alt="psycho_image" />

            <div className="psycho_button">
                {user.role == null && (<Link to={'/login'}>Inicia sesión</Link>)}
                {user.role == 'patient' && user.asig_psycho == null && (<Link to={psychoLink}>Agendar una cita</Link>)}
            </div>
        </section>
    )
}
export default CardImage