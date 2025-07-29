import React , { useEffect, useState }  from 'react'



const MapList = () => {


  const [maps, setMaps] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [nombreMapa, setNombreMapa] = useState("");
  const [nombrePlanta, setNombrePlanta] = useState("");
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [modoPopup, setModoPopup] = useState('creacion');  // creacion - modificacion
  const [idMapaModificacion, setIdMapaModificacion] = useState(-1);

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

    console.log("handleStartMapping");

    /*
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
    */
  };

  const handleUpdateMap = () => {

    const modificacion = {
        nombre_mapa: nombreMapa,
        nombre_planta: nombrePlanta,
    };

    fetch(`http://localhost:8000/maps/${idMapaModificacion}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modificacion),
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        return res.json();
    })
    .then((data) => {
        // Solo modificamos la tabla si el fetch fue exitoso
        setMaps(maps.map((map) => 
            map.id === idMapaModificacion ? { ...map, ...modificacion } : map
        ));

        // Limpiar estados
        setNombreMapa("");
        setNombrePlanta("");
        setIdMapaModificacion(-1);
        setShowPopup(false);
    })
    .catch((err) => {
        console.error("❌ Error al modificar el robot:", err);

        // Limpiar estados
        setNombreMapa("");
        setNombrePlanta("");
        setIdMapaModificacion(-1);
        setShowPopup(false);

        alert("No se pudo modificar el robot. Verificá la conexión o el servidor.");
        // La tabla NO se toca si hay error
    });
    }

    // ********************************************* ENDPOINTS *********************************************

    const popupCreacion = () => {
        console.log("Creacion");
        setModoPopup('creacion');
        setShowPopup(true);
    }

    const popupModificacion = (id) => {
        console.log("modificacion");
        setModoPopup('modificacion');
        setIdMapaModificacion(id); 
        setShowPopup(true);
    }

  return (
      <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">

        {/* Div con boton + Crear Mapa */}
        <div className="mb-6 flex justify-end">
            <button className="btn btn-primary" onClick={popupCreacion}> 
                <span className="material-icons mr-2">add</span> Crear Mapa
            </button>
        </div>

        {/* Popup Creacion nuevo mapa */}
        {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                {modoPopup === 'creacion' ? <h3 className="text-white text-lg font-semibold mb-4">Nuevo mapa</h3> : <h3 className="text-white text-lg font-semibold mb-4">{'Modicacion Mapa: ' + idMapaModificacion}</h3> }
                <label className="block text-gray-300 mb-1">Nombre del mapa</label>
                <input
                    type="text"
                    value={nombreMapa}
                    onChange={(e) => setNombreMapa(e.target.value)}
                    className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                />
                <label className="block text-gray-300 mb-1">Nombre de planta</label>
                <input
                    type="text"
                    value={nombrePlanta}
                    onChange={(e) => setNombrePlanta(e.target.value)}
                    className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                />
                <div className="flex justify-end space-x-2">
                    <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Cancelar</button>
                    <button className="btn btn-primary" onClick={ modoPopup === 'creacion' ? handleAddMap : handleUpdateMap}>Aceptar</button> 
                </div>
            </div>
        </div>
        )}


        {/* Listado mapas */}
        <div className="card">
            <div className="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th className="rounded-tl-lg">Nombre del Mapa</th>
                            <th>Nombre de la Planta</th>
                            <th className="rounded-tr-lg">Acciones</th>
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
                                <td className="flex space-x-1">
                                    <button className="btn-icon btn-secondary" onClick={() => popupModificacion(mapa.id)} title="Modificar mapa">
                                        <span className="material-icons text-base">edit</span>
                                    </button>
                                    <button className="btn-icon btn-secondary" onClick={handleStartMapping} title="Mapear">
                                        <span className="material-icons text-base">map</span>
                                    </button>
                                    <button className="btn-icon btn-danger" onClick={() => handleDeleteMap(mapa.id)} title="Eliminar mapa">
                                        <span className="material-icons text-base">delete</span>
                                    </button>
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
        
      </div>
  )
}

export default MapList
