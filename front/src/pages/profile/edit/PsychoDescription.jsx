function PsychoDescription({ name, lastName, description, onChange, onSubmit }){

    return (
        <div className="profile_form">

            <form className="form_edit_psycho" onSubmit={onSubmit}>

                <div className="edit_inputs">
                    <label>Nombre(s)</label>
                    <input type="text"  name="name" value={name} onChange={onChange} />

                    <label>Apellidos</label>
                    <input type="text"  name='last_name' value={lastName} onChange={onChange}/>

                    <label>Descripción</label>
                    <textarea type="text" name="description" value={description} onChange={onChange} required />
                </div>

                <div className="button_info_submit">
                    <button>Guardar</button>
                </div>

            </form>

        </div>
    )
}

export default PsychoDescription