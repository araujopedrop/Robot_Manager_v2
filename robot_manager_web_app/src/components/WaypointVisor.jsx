import React , { useEffect, useState }  from 'react'

const WaypointVisor = () => {
    const [waypoints, setWaypoints] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [nombreWaypoint, setNombreWaypoint] = useState("");
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);
    const [AngX, setAngX] = useState(0);
    const [AngY, setAngY] = useState(0);
    const [AngZ, setAngZ] = useState(0);

    const [modoPopup, setModoPopup] = useState('creacion');  // creacion - modificacion
    const [idWaypointMoficacion, setIdWaypointMoficacion] = useState(-1);

    const [erroresAngulos, setErroresAngulos] = useState({
        x: false,
        y: false,
        z: false,
        AngX: false,
        AngY: false,
        AngZ: false,
    });

    // ********************************************* ENDPOINTS *********************************************

    useEffect(() => {
        fetch("http://localhost:8000/waypoints", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setWaypoints(data))
            .catch((err) => console.error(err));
        

    }, []);

    const handleAddWaypoint = () => {
        if (nombreWaypoint.trim() === "") {
            alert("El nombre del waypoint no puede estar vacío");
            return;
        }

        const nuevo = {
            waypoint_name: nombreWaypoint,
            x: parseFloat(x),
            y: parseFloat(y),
            z: parseFloat(z),
            AngX: parseFloat(AngX),
            AngY: parseFloat(AngY),
            AngZ: parseFloat(AngZ),
        };

        fetch("http://localhost:8000/waypoints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(nuevo),
        })
            .then((res) => res.json())
            .then((data) => {
                setWaypoints([...waypoints, { ...nuevo, id: data.id }]);
                resetCampos();
                setShowPopup(false);
            })
            .catch((err) => {
                console.error("❌ Error al crear el waypoint:", err);
                resetCampos();
                setShowPopup(false);
                alert("No se pudo crear el waypoint. Verificá la conexión o el servidor.");
            });
    };

    const handleUpdateWaypoint = () => {
        if (nombreWaypoint.trim() === "") {
            alert("El nombre del waypoint no puede estar vacío");
            return;
        }

        const nuevosErrores = {
            x: isNaN(parseFloat(x)),
            y: isNaN(parseFloat(y)),
            z: isNaN(parseFloat(z)),
            AngX: isNaN(parseFloat(AngX)) || parseFloat(AngX) < -180 || parseFloat(AngX) > 180,
            AngY: isNaN(parseFloat(AngY)) || parseFloat(AngY) < -180 || parseFloat(AngY) > 180,
            AngZ: isNaN(parseFloat(AngZ)) || parseFloat(AngZ) < -180 || parseFloat(AngZ) > 180,
        };

        setErroresAngulos(nuevosErrores);

        if (Object.values(nuevosErrores).some((v) => v)) {
            alert("Por favor corregí los campos resaltados.");
            return;
        }

        const modificacion = {
            waypoint_name: nombreWaypoint,
            x: parseFloat(x),
            y: parseFloat(y),
            z: parseFloat(z),
            AngX: parseFloat(AngX),
            AngY: parseFloat(AngY),
            AngZ: parseFloat(AngZ),
        };

        fetch(`http://localhost:8000/waypoints/${idWaypointMoficacion}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(modificacion),
        })
        .then((res) => {
            if (!res.ok) throw new Error("Error en la respuesta del servidor");
            return res.json();
        })
        .then((data) => {
            setWaypoints(waypoints.map((waypoint) =>
                waypoint.id === idWaypointMoficacion ? { ...waypoint, ...modificacion } : waypoint
            ));
            resetCampos();
            setShowPopup(false);
        })
        .catch((err) => {
            console.error("❌ Error al modificar el waypoint:", err);
            resetCampos();
            setShowPopup(false);
            alert("No se pudo modificar el waypoint.");
        });
    };

    const handleDeleteWaypoint = (id) => {
        fetch(`http://localhost:8000/waypoints/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "deleted") {
                    setWaypoints(waypoints.filter((w) => w.id !== id));
                }
            });
    };

    const popupCreacion = () => {
        setModoPopup('creacion');
        setShowPopup(true);
    };

    const popupModificacion = (waypoint) => {

        setModoPopup('modificacion');
        setIdWaypointMoficacion(waypoint.id);
        setNombreWaypoint(waypoint.waypoint_name);
        setX(waypoint.x);
        setY(waypoint.y);
        setZ(waypoint.z);
        setAngX(waypoint.AngX);
        setAngY(waypoint.AngY);
        setAngZ(waypoint.AngZ);
        setShowPopup(true);
    };

    const resetCampos = () => {
        setNombreWaypoint("");
        setX(0);
        setY(0);
        setZ(0);
        setAngX(0);
        setAngY(0);
        setAngZ(0);
        setErroresAngulos({ x: false, y: false, z: false, AngX: false, AngY: false, AngZ: false });
    };

    return (
        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Lista de Waypoints</h3>
                <button className="btn btn-primary" onClick={popupCreacion}>
                    <span className="material-icons mr-2">add</span> Nuevo Waypoint
                </button>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-white text-lg font-semibold mb-4">
                            {modoPopup === 'creacion' ? "Nuevo Waypoint" : `Modificación Waypoint: ${nombreWaypoint}`}
                        </h3>

                        <label className="block text-gray-300 mb-1">Nombre del waypoint</label>
                        <input
                            type="text"
                            value={nombreWaypoint}
                            onChange={(e) => setNombreWaypoint(e.target.value)}
                            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                        />

                        {[['X', x, setX], ['Y', y, setY], ['Z', z, setZ], ['AngX', AngX, setAngX], ['AngY', AngY, setAngY], ['AngZ', AngZ, setAngZ]].map(([label, val, setter]) => (
                            <div key={label}>
                                <label className="block text-gray-300 mb-1">{label}</label>
                                <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => setter(e.target.value)}
                                    className={`w-full mb-4 p-2 rounded bg-gray-700 text-white ${erroresAngulos[label] ? 'border-2 border-red-500' : ''}`}
                                />
                            </div>
                        ))}

                        <div className="flex justify-end space-x-2">
                            <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={modoPopup === 'creacion' ? handleAddWaypoint : handleUpdateWaypoint}>Aceptar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th>Waypoint Name</th>
                            <th>X</th>
                            <th>Y</th>
                            <th>Z</th>
                            <th>AngX</th>
                            <th>AngY</th>
                            <th>AngZ</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {waypoints.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center text-gray-400 py-4">No hay waypoints disponibles</td>
                            </tr>
                        ) : (
                            waypoints.map((waypoint) => (
                                <tr key={waypoint.id}>
                                    <td className="text-white">{waypoint.waypoint_name}</td>
                                    <td className="text-gray-300">{waypoint.x}</td>
                                    <td className="text-gray-300">{waypoint.y}</td>
                                    <td className="text-gray-300">{waypoint.z}</td>
                                    <td className="text-gray-300">{waypoint.AngX}</td>
                                    <td className="text-gray-300">{waypoint.AngY}</td>
                                    <td className="text-gray-300">{waypoint.AngZ}</td>
                                    <td className="flex space-x-1">
                                        <button className="btn-icon btn-secondary" onClick={() => popupModificacion(waypoint)} title="Modificar waypoint">
                                            <span className="material-icons text-base">edit</span>
                                        </button>
                                        <button className="btn-icon btn-danger" onClick={() => handleDeleteWaypoint(waypoint.id)} title="Eliminar waypoint">
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
    );
};

export default WaypointVisor;
