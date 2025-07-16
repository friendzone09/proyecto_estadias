// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';

import './index.css'

export default function NotFound() {
    return (
        <div className='error error-404'>
            <h1>Error 404</h1>
            <span>Oh oh...</span>
            <span>Parece que esta página no existe</span>
            <Link to="/">Volver al inicio</Link>
        </div>
    );
}