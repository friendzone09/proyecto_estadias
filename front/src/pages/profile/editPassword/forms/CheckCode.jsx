function CheckCode ({handleCodeSubmit, setCode, code}){
    return(
        <form onSubmit={handleCodeSubmit}>
            <div className="check_password">
                <label>Ingrese el código de acceso enviado a su correo</label>
                <input 
                type="text" 
                placeholder="Código de verificación..." 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                required
                />
            </div>

            <div className="check_password_button">
                <button type="submit">Verificar código</button>
            </div>
        </form>
    )
}

export default CheckCode