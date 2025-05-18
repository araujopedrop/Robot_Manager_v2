import React, { useState } from 'react';
import './styles.css';
import plusIcon from './assets/plus.png';
import viewIcon from './assets/view.png';
import deleteIcon from './assets/delete.png';

const MapList = () => {
  const [maps, setMaps] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleAddMap = async () => {
    if (newMapName && newLocation) {
      setMaps([...maps, { name: newMapName, location: newLocation }]);
      setNewMapName('');
      setNewLocation('');
      setShowPopup(false);

      try {
        const response = await fetch('http://localhost:8000/maps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre_mapa: newMapName,
            nombre_planta: newLocation,
          }),
        });

        if (!response.ok) {
          console.error('❌ Error al enviar el mapa al backend');
        }
      } catch (error) {
        console.error('❌ Error de red:', error);
      }
    }
  };

  const handleDeleteMap = (index) => {
    const updatedMaps = [...maps];
    updatedMaps.splice(index, 1);
    setMaps(updatedMaps);
  };

  return (
    <div className="map-list-container">
      <h2>Mapas guardados</h2>
      <table className="map-list-table">
        <thead>
          <tr>
            <th>Nombre del mapa</th>
            <th>Nombre de planta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {maps.length === 0 ? (
            <tr>
              <td colSpan="2">—</td>
              <td>
                <button className="add-button" onClick={() => setShowPopup(true)}>
                  <img src={plusIcon} alt="Agregar" className="icon" />
                </button>
              </td>
            </tr>
          ) : (
            maps.map((mapa, index) => (
              <tr key={index}>
                <td>{mapa.name}</td>
                <td>{mapa.location}</td>
                <td>
                  <button className="add-button" onClick={() => setShowPopup(true)}>
                    <img src={plusIcon} alt="Agregar" className="icon" />
                  </button>
                  <button className="add-button" title="Ver mapa">
                    <img src={viewIcon} alt="Ver mapa" className="icon" />
                  </button>
                  <button className="add-button" onClick={() => handleDeleteMap(index)} title="Eliminar mapa">
                    <img src={deleteIcon} alt="Eliminar" className="icon" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-window">
            <h3>Nuevo mapa</h3>
            <label>Nombre del mapa:</label>
            <input
              type="text"
              value={newMapName}
              onChange={(e) => setNewMapName(e.target.value)}
            />
            <label>Nombre de planta:</label>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={handleAddMap}>Aceptar</button>
              <button onClick={() => setShowPopup(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapList;
