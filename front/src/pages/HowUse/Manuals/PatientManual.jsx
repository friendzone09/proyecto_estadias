function PatientManual( {width} ){
    return(
        width <= 800 ? ( <p>Es movil</p> ):( <p>Es desto</p> )
    )
}

export default PatientManual