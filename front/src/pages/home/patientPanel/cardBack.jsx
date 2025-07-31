import { useState, useEffect } from 'react';
import { getAllPsychos } from '../../../utils/get_user';

import LoadingPsycho from '../../../components/LoadingPsycho/LoadingPsycho';

import CardImage from './cardImage';
import CardDescription from './cardDescription';
import './index.css'

function CardBack({ user }) {
    const [psychos, setPshychos] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const data = await getAllPsychos();
                
                const shuffled = [...data];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }

                setPshychos(shuffled);
                
            } catch (err) {
                console.error("Error al obtener psicólogos", err);
            }
        };
        fetchData();
    }, []);


    if (!psychos) return (
    <>
    <LoadingPsycho/>
    <LoadingPsycho/>
    </>
)

    return (

        psychos.length == 0? ( <span className='no-psychos-message'>Aún no hay psicólogos</span> ) : ( 
            psychos.map(p => (
            <section className="psycho_card" key={p.id}>
                <CardImage image={p.image} psychoId={p.id} user={user} />
                <CardDescription description={p.description} name={p.name} lastName={p.last_name} />
            </section>
        ))
         )
    )

}

export default CardBack

