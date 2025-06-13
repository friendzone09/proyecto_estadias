import { useEffect, useState } from "react";

function Screen() {

  const [user, setUser] = useState(null);

  async function loguear() {
    const respose = await fetch('http://localhost:5000/api/second_login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_user: 1 })
    })

    const data = await respose.json();
    console.log(data);
    await getInfo();

  }

  async function logout() {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    console.log('Usuario deslogueado');
    setUser(null);
  }

  async function getInfo() {
    const response = await fetch('http://localhost:5000/api/general_info',{
      method: 'POST',
      credentials: 'include'
    });

    const data = await response.json()
    console.log(data);
    setUser(data.user);
  }

  useEffect(() => {
     getInfo()
  }, []);

  if(!user){
    return(
      <div>
        <span>Inicia sesion</span>
        <button onClick={loguear}>Inicia sesion</button>
      </div>
    )
  } else {
    if(user.role == 'patient')return( <> <p>Panel de pacientes</p> <button onClick={logout}>LogOut</button> </>)
    else if(user.role == 'psycho') return(<> <p>Panel de psicologo</p> <button onClick={logout}>LogOut</button> </>)
    else if(user.role == 'admin') return(<> <p>Panel de administracion</p> <button onClick={logout}>LogOut</button> </>)
  }
};

export default Screen;