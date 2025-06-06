import React, { useEffect, useState } from 'react';
import { getAllPsychos } from '../../utils/get_user';

import CardBack from './patientPanel/cardBack';
import Appointments from './psychoPanel/Dates';
import AdminHouse from './adminPanel/AdminHome';

import { useLoading } from '../../components/loading/LoadingContext';

import './index.css'

function Home({ userType }) {
  const { setLoading } = useLoading();
  const [psychos, setPshychos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllPsychos();
        setPshychos(data);
      } catch (err) {
        console.error("Error al obtener psicólogos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading]);

  if (!psychos) return null;

  return (
    <section className="main_section">
      {userType === 'psycho' && <Appointments />}

      {(userType === 'patient' || userType === null) && (
        psychos.map(p => (
          <CardBack psycho={p} key={p.id} userType={userType} />
        ))
      )}

      {userType === 'admin' && <AdminHouse />}
    </section>
  );
}

export default Home;