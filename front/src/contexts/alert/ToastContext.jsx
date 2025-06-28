import { createContext, useContext, useState } from 'react';
import AlertContainer from './AlertContainer';

const ToastContext = createContext();

let idCounter = 0;

export function ToastProvider({ children }) {
    const [alerts, setAlerts] = useState([]);

    const addAlert = (message, type = 'success') => {
        const id = ++idCounter;
        setAlerts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 2500);
    };

    return (
        <ToastContext.Provider value={{ addAlert }}>
            {children}
            <AlertContainer alerts={alerts} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}