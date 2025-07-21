import React , { useEffect, useState }  from 'react'

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





  return (
      <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">

        {/* Div con boton + Crear Mapa */}
        <div className="mb-6 flex justify-end">
            <button className="btn btn-primary" onClick={() => setShowPopup(true)}>
                <span className="material-icons mr-2">add</span> Crear Mapa
            </button>
        </div>

        {/* Popup Creacion nuevo mapa */}
        {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-white text-lg font-semibold mb-4">Nuevo Mapa</h3>
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
                    <button className="btn btn-primary" onClick={handleAddMap}>Aceptar</button>
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
                                    <button className="btn-icon btn-secondary" onClick={handleStartMapping} title="Modificar mapa">
                                        <span className="material-icons text-base">edit</span>
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
