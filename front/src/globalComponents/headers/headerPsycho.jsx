import LogOutButton from "../components/LogOutButton"
function HeaderPsycho(){

    const psychoData = localStorage.getItem('psycho_user')
    const psycho = JSON.parse(psychoData)
    const psychoImage = `http://127.0.0.1:5000/uploads/${psycho.image}`

    return(
        <>
            <div className="header_pages">
                <a href="/">Citas</a>
                <LogOutButton/>
            </div>

            <div className="pyscho_profile">
                <a href="/profile"><img src={psychoImage} alt="" /></a>
            </div>
        </>
    )
}

export default HeaderPsycho