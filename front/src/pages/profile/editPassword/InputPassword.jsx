import { useState } from "react"
import { getUser } from "../../../utils/get_user"
import CheckPassword from "./forms/CheckPassword";
import CheckCode from "./forms/CheckCode";

function InputPassword(){

    const [password, setPassword] = useState('')
    const [isPassword, setIsPassword] = useState(false);
    const [success, setSuccess] = useState('')
    const [code, setCode] = useState('')

    async function checkPassword(e) {

        e.preventDefault()

        const psycho = getUser();
        const id = psycho.user_id;

        const response = await fetch('http://127.0.0.1:5000/api/check_password',{
            method : 'POST',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
                'id' : id,
                'password' : password, 
            })
        })

        const data = await response.json()

        if(data.type == 'success') setIsPassword(true)

        else setSuccess('error')

        console.log(data)
    }

    function handleCodeSubmit(e) {
        e.preventDefault();
        console.log("Código ingresado:", code);
    }

    return(
        <div className="insert_password">   
            {!isPassword ? (<CheckPassword 
            checkPassword={checkPassword}
            password={password} 
            setPassword={setPassword}
            success={success}/>): 
            (<CheckCode 
            handleCodeSubmit={handleCodeSubmit}
            code={code}
            setCode={setCode}
            />)}
        </div>
    )
}

export default InputPassword