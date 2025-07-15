import DeskPysho from "./PsychoManuals/DeskPsycho"
import PhonePsycho from "./PsychoManuals/PhonePsycho"

function PsychoManual( { width } ){
    return(
        width > 800? (<DeskPysho/>) : (<PhonePsycho/>)
    )
}

export default PsychoManual