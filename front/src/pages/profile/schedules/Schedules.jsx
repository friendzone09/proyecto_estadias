import SelectDay from "./SelectDay"
import ShowHours from "./ShowHours"

import { useState } from "react"
import './index.css'

function Schedule(){

    const [selectedDay, setSelectedDay] = useState(null);

    return(
        <div className="schedules">
            <SelectDay onDayChange={setSelectedDay}/>
            <ShowHours selectedDay={selectedDay} />
        </div>
    )
}

export default Schedule