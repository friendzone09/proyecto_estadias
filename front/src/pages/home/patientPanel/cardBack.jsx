import CardImage from './cardImage';
import CardDescription from './cardDescription';
import './index.css'

function CardBack({psycho, userType}){

    console.log(psycho)

    return(
        <section className="psycho_card">
            <CardImage image = {psycho.image} name= {psycho.name} lastName={psycho.last_name}/>
            <CardDescription description = {psycho.description} userType = {userType} psychoId = {psycho.id} />
        </section>
    )
}

export default CardBack