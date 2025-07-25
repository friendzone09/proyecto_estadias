import './index.css'
import { X } from 'lucide-react'

function CookiesAlert({ onClose, open = 'close'}){
    return(
        <>
        <div className={`cookie_alert--back ${open}--back`} onClick={onClose}></div>
        <div className={`cookie_alert--alert  ${open}--alert`}>
            <div className="cookies_alert--message">
                <div className="message--close_button">
                    <button onClick={onClose}><X size={25} color='white'/></button>
                </div>
                <span>Esta aplicación web necesita cookies para poder inicar sesión. Procura tenerlas activadas.</span>
                <div className="message--close_button">
                    <span onClick={onClose}>Cerrar</span>
                </div>
            </div>
        </div>
        </>
    )
}

export default CookiesAlert