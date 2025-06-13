function CardImage({ image, psychoId, user }) {

    const imageUrl = `http://127.0.0.1:5000/uploads/${image}`
    const psychoLink = `/appointAgend/${psychoId}`;

    return (
        <section className="psycho_image">
            <img src={imageUrl} alt="psycho_image" />

            <div className="psycho_button">
                {user.role == null && (<a href="/login">Inicia sesión</a>)}
                {user.role == 'patient' && user.asig_psycho == null && (<a href={psychoLink} >Agendar una cita</a>)}
            </div>
        </section>
    )
}
export default CardImage