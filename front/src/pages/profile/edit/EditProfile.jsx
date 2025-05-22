import PsychoDescription from "./PsychoDescription"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PsychoImage from './PsychoImage'
import { getPsychoInfo, getPsychoId } from "../../../utils/get_user"
import { updatePsycho } from "../../../utils/updatePsycho"

function EditProfile(){

     const [info, setInfo] = useState({
        name: "",
        last_name: "",
        description: "",
        image: ""
    });

    const [selectedImage, setSelectedImage] = useState(null)

    const navigate = useNavigate();

    async function callInfo() {
        const data = await getPsychoInfo()
        setInfo(data)
    }

    useEffect(()=>{   
        callInfo()
    }, [])


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

        const id = getPsychoId()

        const formData = new FormData()
        formData.append("id", id)
        formData.append("name", info.name)
        formData.append("last_name", info.last_name)
        formData.append("description", info.description)

        if (selectedImage) {
            formData.append("image", selectedImage)
        }

        const response = await updatePsycho(formData, id)
        navigate('/profile')

    }

    return(
       <div className="pyscho_profile_section">
            <PsychoImage imageName = {info.image} onImageChange={handleImageChange}/>
            <PsychoDescription name={info.name} lastName={info.last_name} description={info.description} onChange={handleChange} onSubmit={handleSubmit}/>
       </div> 
    )

}

export default EditProfile