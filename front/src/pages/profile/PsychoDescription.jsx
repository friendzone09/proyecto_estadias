import { Link } from 'react-router-dom'

function PsychoDescription( {PsychoDescription} ){
    return (
        <div className="description_secction">

            <div className="profile_description">
                <h1>Descripción</h1>
                <section className="description">
                    <p> {PsychoDescription} </p>
                </section>
            </div>

            <div className="profile_edit_buttons">
                <Link to={'/profile/edit/password'} className="go_to_change_password">Cambiar contraseña</Link>
                <Link to={'/profile/edit'} className='go_to_edit_profile'>Editar información</Link>
            </div>

        </div>
    )
}

export default PsychoDescription