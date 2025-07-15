import PhonePatient from "./PatientManuals/PhonePatient"
import DeskPatient from "./PatientManuals/DeskPatient"

function PatientManual( { width } ){
    return(
        width > 800? (<DeskPatient/>) : (<PhonePatient/>)
    )
}

export default PatientManual