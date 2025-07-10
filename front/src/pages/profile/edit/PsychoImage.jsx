function PsychoImage({imageName, onImageChange}){

    return(
        <div className="section_psycho_image">

            <div className="profile_psycho_image">
                <img src={imageName} alt="" />
            </div>
            
            <div className="button_edit_schedule">
                <input type="file" id="fileInput" name="image" accept="image/png, image/jpeg, image/jpg" onChange={onImageChange} />
                <label htmlFor="fileInput">Subir imagen</label>
            </div>
        </div>
    )
}

export default PsychoImage