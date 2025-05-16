function CardImage ({image, name, lastName}){

    const imageUrl =  `http://127.0.0.1:5000/uploads/${image}` 

    return(
        <section className="psycho_image">
            <img src={imageUrl} alt="" />
            <p>Lic. {name} {lastName}</p>
        </section>
    )
}

export default CardImage