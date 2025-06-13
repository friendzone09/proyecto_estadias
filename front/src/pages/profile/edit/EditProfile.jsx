import PsychoDescription from "./PsychoDescription"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PsychoImage from './PsychoImage'
import { updatePsycho } from "../../../utils/updatePsycho"

import { useToast } from "../../../contexts/alert/ToastContext"
import { useUser } from "../../../contexts/userContext/UserContext"

function EditProfile() {

    const { user, setUser } = useUser();

    const { addAlert } = useToast();

    const [selectedImage, setSelectedImage] = useState(null)
    const [info, setInfo] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'psycho') {
            setInfo({
                id: user.id,
                name: user.name,
                last_name: user.last_name,
                description: user.description,
            });
        } else if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    function handleChange(e) {
        const { name, value } = e.target
        setInfo(prev => ({ ...prev, [name]: value }))
    }

    function handleImageChange(e) {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const id = user.id;

        const formData = new FormData()
        formData.append("id", id)
        formData.append("name", info.name)
        formData.append("last_name", info.last_name)
        formData.append("description", info.description)

        if (selectedImage) {
            formData.append("image", selectedImage)
        }

        const data = await updatePsycho(formData, id)

        if (data.type == 'success') {

            if (data.user) {
                setUser(data.user); // <-- actualizar el usuario global
            }

            navigate('/profile', {
                state: { toast: { type: data.type, message: data.message } }
            })
            return
        }

        addAlert(data.message, data.type)
        return
    }

    if(!user || !info) return null

    return (
        <div className="pyscho_profile_section">
            <PsychoImage imageName={user.image} onImageChange={handleImageChange} />
            <PsychoDescription user={info} onChange={handleChange} onSubmit={handleSubmit} />
        </div>
    )

}

export default EditProfile