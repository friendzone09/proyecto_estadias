function CardDescription({description, name, lastName}){

    return(
        <section className="card_description">

            <div className="psycho_decription">

                <h1>Lic. {name} {lastName} </h1>

                <p>{description}</p>

            </div>

        </section>
    )
}

export default CardDescription