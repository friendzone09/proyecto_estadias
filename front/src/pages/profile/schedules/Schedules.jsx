import SelectDay from "./SelectDay"
import ShowHours from "./ShowHours"

import { useState, useEffect } from "react"
import { useUser } from "../../../contexts/userContext/UserContext"
import { useNavigate } from "react-router-dom"
import './index.css'

function Schedule(){
    
    const { user } = useUser();
    const navigate = useNavigate()

    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        if (user && (user.role !== 'psycho')) {
            navigate('/')
        }
    }, [user, navigate])

    if(!user) return null;

    return(
        <div className="schedules">
            <SelectDay onDayChange={setSelectedDay}/>
            <ShowHours selectedDay={selectedDay} />
        </div>
    )
}

export default Schedule