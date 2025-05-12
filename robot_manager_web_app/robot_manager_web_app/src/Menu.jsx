import React from "react";
import "./styles.css";
import logo from "./assets/logo.jpeg";

const Menu = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo del sistema" className="sidebar-logo" />
      </div>

      <div className="sidebar-top">
        <button className="sidebar-button">Inicio</button>
        <button className="sidebar-button">Robots</button>
        <button className="sidebar-button">Mapas</button>
        <button className="sidebar-button">Misiones</button>
      </div>

      <div className="sidebar-bottom">
        <button className="sidebar-button">Configuración</button>
      </div>
    </div>
  );
};

export default Menu;
