function CardDescription({description, userType, psychoId}){

    const psychoLink = `/appointAgend/${psychoId}`;

    return(
        <section className="card_description">

            <div className="psycho_decription">

                <h1>Descripción</h1>

                <p>{description}</p>

            </div>

            <div className="psycho_button">

                {userType == null &&( <a href="/login">Si quieres agendar una cita primero inicia sesión</a> )}
                {userType == false &&( <a href={psychoLink} >Agendar una cita</a> )}

            </div>


        </section>
    )
}

export default CardDescription