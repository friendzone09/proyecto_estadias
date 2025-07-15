import { useState } from "react"

function PsychoImage({ imageName, onImageChange }) {

    const [previewImage, setPreviewImage] = useState(null)

    function handleChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        };
    };

    return (
        <div className="section_psycho_image">

            <div className="profile_psycho_image">
                <img src={imageName} alt="" />
            </div>

            {previewImage && (
                <div className="preview_image">
                    <span>Vista previa</span>
                    <img alt="Vista previa" src={previewImage} width='100' />
                </div>
            )}

            <div className="button_edit_schedule">
                <input type="file" id="fileInput" name="image" accept="image/png, image/jpeg, image/jpg" onChange={(e) => { handleChange(e); onImageChange(e); }} />
                <label htmlFor="fileInput">Subir imagen</label>
            </div>
        </div>
    )
}

export default PsychoImage