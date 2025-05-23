import { useToast } from "./components/alert/ToastContext"

function Test(){

    const { addAlert } = useToast();

    return(
        <div className="test">

            <button onClick={() => addAlert("Guardado correctamente", "success")}>Success</button>
            <button onClick={() => addAlert("Advertencia", "warning")}>Warning</button>
            <button onClick={() => addAlert("Error crítico", "error")}>Error</button>

            <p>Este es un texto de ejemplo</p>
    
        </div>
    )
}

export default Test