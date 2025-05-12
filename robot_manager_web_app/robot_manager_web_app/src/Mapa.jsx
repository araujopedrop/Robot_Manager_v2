import React from "react";
import "./styles.css";
import mapa from "./assets/mapa1.png"; 
import camara from "./assets/camera.png"; 

const MapSection = () => {
  return (
    <div className="map-column">
      <img src={mapa} alt="Mapa del entorno" className="map-image" />
    </div>
  );
};

export default MapSection;
