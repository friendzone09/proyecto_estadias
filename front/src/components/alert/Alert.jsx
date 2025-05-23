import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

import './index.css'

function Alert( {type = 'succes', children} ){

    let Icon;

    if (type === 'success') Icon = CheckCircle; 
    else if (type === 'warning') Icon = AlertTriangle;    
    else if (type === 'error') Icon = XCircle;
    
    return (
        <div className={`alert color-${type} toast-${type}`}>
            <div className="alert_text_area">
                {Icon && <Icon className={`icon-${type}`}/>}
                <span> {children} </span>
            </div>

            <div className={`alert_loading loading-${type}`}></div>
        </div>
    )
}

export default Alert