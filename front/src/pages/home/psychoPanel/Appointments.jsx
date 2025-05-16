import { useEffect } from "react"

function Appointments ({ date }){

    function isPastDate(){
    if (date.day === "") return false;

    const selectedDate = new Date(
        parseInt(date.year),
        parseInt(date.monthNum) - 1,
        parseInt(date.day)
    );

    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if(selectedDate >= today){
        console.log('Aqui ira un fecth jejejej');
    }

    return selectedDate < today;

    };

    useEffect(()=>{
        if(date.day != ''){
            console.log('Cambio de dia')
        }
    }, [date])

    return (
        <div className="appointments">

            {date.day === "" ? (<h1>Seleccione una fecha</h1>): 
            isPastDate() ? (<h1>Día ya no disponible</h1>):
            (<h1>{date.month} {date.day} - {date.year}</h1>)}
            
        </div>
    )
}

export default Appointments