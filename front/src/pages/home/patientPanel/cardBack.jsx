import CardImage from './cardImage';
import CardDescription from './cardDescription';
import './index.css'

function CardBack({psycho, userType}){

    return(
        <section className="psycho_card">
            <CardImage image = {psycho.image} psychoId={psycho.id} userType={userType} />
            <CardDescription description = {psycho.description} name={psycho.name} lastName={psycho.last_name} />
        </section>
    )
}

export default CardBack