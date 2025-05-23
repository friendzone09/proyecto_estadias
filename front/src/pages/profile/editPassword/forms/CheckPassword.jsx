function CheckPassword({ checkPassword, password, setPassword, success }){
    return(
        <form onSubmit={checkPassword}>

            <div className="check_password">
                <label>Ingrese su contraseña</label>
                <input type="password" 
                placeholder="Contraseña..." 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required/>
            </div>

            {success == 'error' &&  <small>Contraseña incorrecta</small> }

            <div className="check_password_button">
                <button>Sguiente</button>
            </div>

        </form>
    )
}

export default CheckPassword