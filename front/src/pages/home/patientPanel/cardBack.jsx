import { useState, useEffect } from 'react';
import { getAllPsychos } from '../../../utils/get_user';

import { useLoading } from '../../../contexts/loading/LoadingContext';

import CardImage from './cardImage';
import CardDescription from './cardDescription';
import './index.css'

function CardBack({ user }) {
    const [psychos, setPshychos] = useState([]);
    const { setLoading } = useLoading();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await getAllPsychos();
                setPshychos(data);
            } catch (err) {
                console.error("Error al obtener psicólogos", err);
            } 
            setLoading(false)
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