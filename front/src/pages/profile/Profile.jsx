import { getPsycho } from "../../utils/get_user"
import { getUserType } from "../../utils/get_user"
import './index.css'

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import PsychoImage from "./PsychoImage"
import PsychoDescription from "./PsychoDescription"

function Profile(){

    const navigate = useNavigate()
    const [psycho, setPsycho] = useState(null);

    console.log(psycho)

    useEffect(()=>{
        
        const data = getPsycho();

        if (!data || data.type === false) {
            navigate('/');
        } else {
            setPsycho(data);
        }
        

    }, [])

    if (!psycho) return null;

    return(

        <section className="pyscho_profile_section">
            <PsychoImage imageName = {psycho.image } name={psycho.name} lastName={psycho.last_name}/>
            <PsychoDescription  />
        </section>

    )
}

export default Profile