import React, { useEffect, useState } from "react";
import "./styles.css";
import plusIcon from "./assets/plus.png";
import mapIcon from "./assets/view.png";
import deleteIcon from "./assets/delete.png";
import MapaROS from "./MapaROS";

const MapList = () => {
  const [maps, setMaps] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [nombreMapa, setNombreMapa] = useState("");
  const [nombrePlanta, setNombrePlanta] = useState("");
  const [mostrarMapa, setMostrarMapa] = useState(false);

  // Get maps
  useEffect(() => {
    fetch("http://localhost:8000/maps")
      .then((res) => res.json())
      .then((data) => setMaps(data))
      .catch((err) => console.error(err));
  }, []);

  // Create Map
  const handleAddMap = () => {
    const nuevo = {
      nombre_mapa: nombreMapa,
      nombre_planta: nombrePlanta,
    };
    fetch("http://localhost:8000/maps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    })
      .then((res) => res.json())
      .then((data) => {
        setMaps([...maps, { ...nuevo, id: data.id }]);
        setNombreMapa("");
        setNombrePlanta("");
        setShowPopup(false);
      })
      .catch((err) => console.error(err));
  };

  // Delete Map
  const handleDeleteMap = (id) => {
    fetch(`http://localhost:8000/maps/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "deleted") {
          setMaps(maps.filter((m) => m.id !== id));
        }
      });
  };

  // Start/Modify Map
  const handleStartMapping = () => {
    fetch("http://localhost:8000/start-mapping", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔄 start_mapping response:", data);
        alert(data.message || "SLAM iniciado");
        setMostrarMapa(true);
      })
      .catch((err) => {
        console.error("❌ Error al iniciar SLAM:", err);
        alert("Error al iniciar SLAM");
      });
  };

  return (
    <div className="map-list-container">
      <h2>Gestión de Mapas</h2>
      <table className="map-list-table">
        <colgroup>
          <col />
          <col />
          <col style={{ width: "120px" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Nombre de mapa</th>
            <th>Nombre de planta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {maps.length === 0 ? (
            <tr>
              <td colSpan="3" className="no-maps">No hay mapas disponibles</td>
            </tr>
          ) : (
            maps.map((mapa) => (
              <tr key={mapa.id}>
                <td>{mapa.nombre_mapa}</td>
                <td>{mapa.nombre_planta}</td>
                <td className="acciones">
                  <img
                    src={mapIcon}
                    alt="Ver Mapa"
                    className="icon"
                    onClick={handleStartMapping}
                  />
                  <img
                    src={deleteIcon}
                    alt="Eliminar"
                    className="icon"
                    onClick={() => handleDeleteMap(mapa.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button className="add-button" onClick={() => setShowPopup(true)}>
        <img src={plusIcon} alt="Agregar" className="icon" />
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-window">
            <h3>Nuevo Mapa</h3>
            <label>Nombre del mapa</label>
            <input
              type="text"
              value={nombreMapa}
              onChange={(e) => setNombreMapa(e.target.value)}
            />
            <label>Nombre de planta</label>
            <input
              type="text"
              value={nombrePlanta}
              onChange={(e) => setNombrePlanta(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={handleAddMap}>Aceptar</button>
              <button onClick={() => setShowPopup(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarMapa && (
        <div style={{ marginTop: "2rem" }}>
          <MapaROS />
        </div>
      )}
    </div>
  );
};

export default MapList;