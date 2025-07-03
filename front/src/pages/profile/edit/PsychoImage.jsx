function PsychoImage({imageName, onImageChange}){

    const API_URL = import.meta.env.VITE_API_URL
    const imgurl = `${API_URL}/uploads/${imageName}`

    return(
        <div className="section_psycho_image">

            <div className="profile_psycho_image">
                <img src={imgurl} alt="" />
            </div>
            
            <div className="button_edit_schedule">
                <input type="file" id="fileInput" name="image" accept="image/png, image/jpeg, image/jpg" onChange={onImageChange} />
                <label htmlFor="fileInput">Subir imagen</label>
            </div>
        </div>
    )
}

export default PsychoImage