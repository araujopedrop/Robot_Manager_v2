import React from "react";
import "./styles.css";

const AutoMode = () => {
  const misiones = [
    "Patrullar perímetro",
    "Ir a estación de carga",
    "Inspección de pasillo A",
    "Entrega de paquete",
    "Volver a base",
  ];

  return (
    <div className="auto-mode">
      <h3>Modo Automático</h3>
      <ul className="lista-misiones">
        {misiones.map((mision, index) => (
          <li key={index}>{mision}</li>
        ))}
      </ul>
    </div>
  );
};

export default AutoMode;
