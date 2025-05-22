function PsychoImage({imageName, name, lastName}){

    const imgurl = `http://127.0.0.1:5000/uploads/${imageName}`

    return(

        <section className="section_psycho_image">
            <div className="profile_psycho_image">
                <img src={imgurl} alt="" />

                <span> Lic. {name} {lastName} </span>
            </div>

            <div className="button_edit_schedule">
                <a href="/profile/schedules">Editar horarios</a>
            </div>
        </section>

    )
}

export default PsychoImage