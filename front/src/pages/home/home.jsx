import React, { useEffect, useState } from 'react';
import CardBack from './patientPanel/cardBack';
import Appointments from './psychoPanel/Dates';
import './index.css'

function Home({ userType }){

    const [psychos, setPshychos] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:5000/psychos')
      .then(response => response.json())
      .then(data => {
        setPshychos(data);
      })
      .catch(error => {
        console.error('Error al cargar psicólogos:', error);
      });
    }, [])

    return(
            <section className="main_section">

              {userType == true && ( <Appointments/> ) }

              {userType != true && (
                psychos.map(p => (
                  <CardBack psycho = {p} key = {p.id} userType = {userType}/>
                ))
              )}
      
            </section>         
    )
}

export default Home