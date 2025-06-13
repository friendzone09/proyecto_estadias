import CardBack from './patientPanel/cardBack';
import Appointments from './psychoPanel/Dates';
import AdminHouse from './adminPanel/AdminHome';

import './index.css'

function Home({ user }) {

  if (!user) return null;

  return (
    <section className="main_section">
      {user.role === 'psycho' && <Appointments user={user}/>}

      {(user.role === 'patient' || user.role === null) && <CardBack user={user} />}

      {user.role === 'admin' && <AdminHouse />}
    </section>
  );
}

export default Home;