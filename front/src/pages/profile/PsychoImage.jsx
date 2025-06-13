import { Link } from "react-router-dom"

function PsychoImage({user}){
    const imgurl = `http://127.0.0.1:5000/uploads/${user.image}`

    return(

        <section className="section_psycho_image">
            <div className="profile_psycho_image">
                <img src={imgurl} alt="" />

                <span> Lic. {user.name} {user.last_name} </span>
            </div>

            <div className="button_edit_schedule">
                <Link to={"/profile/schedules"}>Editar horarios</Link>
            </div>
        </section>

    )
}

export default PsychoImage