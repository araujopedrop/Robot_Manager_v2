import React from 'react';
import logo from './assets/logo.jpeg'; // importa correctamente la imagen
import './styles.css';

const Menu = ({ setCurrentView }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>

      <div className="sidebar-top">
        <button className="sidebar-button" onClick={() => setCurrentView('home')}>Inicio</button>
        <button className="sidebar-button" onClick={() => setCurrentView('robots')}>Robots</button>
        <button className="sidebar-button" onClick={() => setCurrentView('mapas')}>Mapas</button>
        <button className="sidebar-button" onClick={() => setCurrentView('misiones')}>Misiones</button>
      </div>

      <div className="sidebar-bottom">
        <button className="sidebar-button">Configuración</button>
      </div>
    </div>
  );
};

export default Menu;
