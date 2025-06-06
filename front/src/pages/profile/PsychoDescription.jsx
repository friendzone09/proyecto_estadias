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
                <a href="/profile/edit/password" className="go_to_change_password">Cambiar contraseña</a>
                <a href="/profile/edit" className="go_to_edit_profile">Editar información</a>
            </div>

        </div>
    )
}

export default PsychoDescription