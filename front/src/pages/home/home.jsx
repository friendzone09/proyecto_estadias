import React, { useEffect, useState } from 'react';
import { getAllPsychos } from '../../utils/get_user';

import CardBack from './patientPanel/cardBack';
import Appointments from './psychoPanel/Dates';
import AdminHouse from './adminPanel/AdminHome';

import './index.css'

function Home({ userType }){

  const [psychos, setPshychos] = useState([]);

  async function callPsychos() {
    const data = await getAllPsychos();
    setPshychos(data);
  }

  useEffect(()=>{
    callPsychos()
  }, [])

    return(
            <section className="main_section">
              {userType === 'psycho' && ( <Appointments/> ) }

              {(userType === 'patient' || userType === null) && (
                psychos.map(p => (
                  <CardBack psycho = {p} key = {p.id} userType = {userType}  />
                ))
              )}

              {userType === 'admin' && (<AdminHouse/>)}
            </section>         
    )
}

export default Home