import { getAllPsychos } from "../../../utils/get_user"
import { useState, useEffect } from "react"

function SelectPsycho( { onChange } ){

    const [psychos, setPsychos] = useState([])
    const [selectedPsycho, setSelectedPsycho] = useState(null);

    async function callPsychos(){
        const data = await getAllPsychos();
        setPsychos(data)
    }

    function handleSelectChange(e) {
        const selectedId = e.target.value;
        setSelectedPsycho(selectedId);
        if (onChange) onChange(selectedId);
    }

    useEffect(()=>{
        callPsychos()
    }, [])

    return(
            <select name="" className="SelectPsycho" onChange={handleSelectChange}>
                <option value={0} >Seleccione un psicólogo</option>
                {psychos.map(p =>(
                    <option value={p.id} key={p.id}> {p.name} {p.last_name} </option>
                ))}
            </select>
    )
}

export default SelectPsycho