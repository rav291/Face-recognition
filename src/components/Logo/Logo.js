import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className="Tilt br2 shadow-1" options={{ max: 70 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3"><img src={brain} alt="Hi" style={{ paddingTop: '10px' }} /></div>
            </Tilt>
        </div>
    );
}

export default Logo;