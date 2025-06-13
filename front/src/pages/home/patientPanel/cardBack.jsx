import { useState, useEffect } from 'react';
import { getAllPsychos } from '../../../utils/get_user';

import CardImage from './cardImage';
import CardDescription from './cardDescription';

import { useLoading } from '../../../contexts/loading/LoadingContext';
import './index.css'

function CardBack({ user }) {
    const [psychos, setPshychos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllPsychos();
                setPshychos(data);
            } catch (err) {
                console.error("Error al obtener psicólogos", err);
            } 
        };
        fetchData();
    }, []);


    if (!psychos) return null;

    return (

        psychos.map(p => (
            <section className="psycho_card" key={p.id}>
                <CardImage image={p.image} psychoId={p.id} user={user} />
                <CardDescription description={p.description} name={p.name} lastName={p.last_name} />
            </section>
        ))

    )
}

export default CardBack