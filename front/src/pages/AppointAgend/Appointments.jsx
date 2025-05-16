import { data } from "react-router-dom";
import { getSchedule } from "../../utils/getSchedule";
import { useEffect, useState } from "react"

function Appointments ({ date, id_psycho }){

    const [psycho, setPsycho] = useState({name: '' , last_name : ''})
    const [schedule, setSchedule] = useState([])

    const selectedDate = new Date(
            parseInt(date.year),
            parseInt(date.monthNum) - 1,
            parseInt(date.day)
    );

    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    function isPastDate(){
        if (date.day === "") return false;

        return selectedDate < today;
    };

    useEffect(()=>{

        async function callGetSchedule() {

            const newDate = `${date.year}-${date.monthNum}-${date.day}`;
            
            const formData = new FormData()
            formData.append('id', id_psycho);
            formData.append('date', newDate);

            const data = await getSchedule(formData)

            if(selectedDate < today){
                console.log('Ese dia no carnal')
                setSchedule([]);
                return null
            }

            if(data.schedule){
                setSchedule(data.schedule)
            } else{
                setSchedule([]);
            }
        }

        if(date.day != ''){
            console.log('Cambio de dia')
        }

        callGetSchedule();

    }, [date])

    useEffect(()=>{
        async function getPsycho() {

            const formData = new FormData();
            formData.append('id',id_psycho)

            const response = await fetch('http://127.0.0.1:5000/get_psycho',{
                method : 'POST',
                body : formData
            });

            if(!response.ok){
                console.log('Salio mal w')
            } 

            const data = await response.json()

            setPsycho(data)

            console.log(data)
        }

        getPsycho()
    }, [])

    return (
        <div className="appointments">

            <small>Lic. {psycho.name} {psycho.last_name} </small>

            {date.day === "" ? (<h1>Seleccione una fecha</h1>): 
            isPastDate() ? (<h1>Día ya no disponible</h1>):
            (<h1>{date.month} {date.day} - {date.year}</h1>)}

            <div className="schedule">

                {schedule.length==0?  (<p>nel</p>) : (<p>simon</p>) }

            </div>


        </div>
    )
}

export default Appointments