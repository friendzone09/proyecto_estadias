import { useEffect, useState } from "react"
import { getPsychoInfo } from "../../utils/get_user"

function PsychoDescription(){

    const [description, setDescription] = useState('')

    useEffect(()=>{
        async function callDescription() {
            const data = await getPsychoInfo()
            setDescription(data.description)
        }

        callDescription()
    }, [])


    return (
        <div className="description_secction">

            <div className="profile_description">
                <h1>Descripción</h1>
                <p> {description} </p>
            </div>

            <div className="profile_edit_buttons">
                <a href="/profile/edit/password" className="go_to_change_password">Cambiar contraseña</a>
                <a href="/profile/edit" className="go_to_edit_profile">Editar información</a>
            </div>

        </div>
    )
}

export default PsychoDescription