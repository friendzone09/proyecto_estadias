// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../static/images/Error/rinSticker.webp'

import './index.css'

export default function NotFound() {
    return (
        <div className='error error-404'>
            <img src={logo} alt="" />
            <h1>Error 404</h1>
            <span>Oh oh...</span>
            <span>Parece que esta página no existe</span>
            <Link to="/">Volver al inicio</Link>
        </div>
    );
}