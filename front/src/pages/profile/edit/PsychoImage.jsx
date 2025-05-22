function PsychoImage({imageName, onImageChange}){

    const imgurl = `http://127.0.0.1:5000/uploads/${imageName}`

    return(
        <div className="profile_psycho_image">
            <img src={imgurl} alt="" />

            <input type="file" name="image" accept="image/png, image/jpeg, image/jpg" onChange={onImageChange} />
        </div>
    )
}

export default PsychoImage