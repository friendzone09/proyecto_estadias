import React, { createContext, useState, useContext } from 'react';
import './styles.css'

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);
export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {loading && (
                <div className="loading-overlay">
                    <div className="dots-loader">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                    <span>Cargando...</span>
                </div>
            )}
            {children}
        </LoadingContext.Provider>
    );
};