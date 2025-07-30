import React , { useEffect, useState }  from 'react'

const RobotVisor = () => {

    const [robots, setRobots] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [nombreRobot, setNombreRobot] = useState("");
    const [tipoRobot, setTipoRobot] = useState("");
    const [statusRobot, setStatusRobot] = useState("");
    const [mostrarRobot, setMostrarRobot] = useState(false);
    const [modoPopup, setModoPopup] = useState('creacion');  // creacion - modificacion
    const [idRobotMoficacion, setidRobotMoficacion] = useState(-1);


    // ********************************************* ENDPOINTS *********************************************

    // Get robots
    useEffect(() => {
    fetch("http://localhost:8000/robots", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setRobots(data))
        .catch((err) => console.error(err));
    }, []);


    // Create Robot
    const handleAddRobot = () => {
        const nuevo = {
            nombre_robot: nombreRobot,
            tipo_robot: tipoRobot,
            status_robot: "Offline",
        };
        fetch("http://localhost:8000/robots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(nuevo),
        })
            .then((res) => res.json())
            .then((data) => {
            setRobots([...robots, { ...nuevo, id: data.id }]);
            setNombreRobot("");
            setTipoRobot("");
            setStatusRobot("");
            setShowPopup(false);
            })
            .catch((err) => console.error(err));
    };


    // Update Robot
    const handleUpdateRobot = () => {
        const modificacion = {
            nombre_robot: nombreRobot,
            tipo_robot: tipoRobot,
            status_robot: "Offline",
        };

        fetch(`http://localhost:8000/robots/${idRobotMoficacion}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
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
            setRobots(robots.map((robot) => 
                robot.id === idRobotMoficacion ? { ...robot, ...modificacion } : robot
            ));

            // Limpiar estados
            setNombreRobot("");
            setTipoRobot("");
            setStatusRobot("");
            setidRobotMoficacion(-1);
            setShowPopup(false);
        })
        .catch((err) => {
            console.error("❌ Error al modificar el robot:", err);
    
            // Limpiar estados
            setNombreRobot("");
            setTipoRobot("");
            setStatusRobot("");
            setidRobotMoficacion(-1);
            setShowPopup(false);

            alert("No se pudo modificar el robot. Verificá la conexión o el servidor.");
            // La tabla NO se toca si hay error
        });
    };



    // Delete Robot
    const handleDeleteRobot = (id) => {
    fetch(`http://localhost:8000/robots/${id}`, {
        method: "DELETE",
        credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => {
        if (data.status === "deleted") {
            setRobots(robots.filter((m) => m.id !== id));
        }
        });
    };

    // ********************************************* ENDPOINTS *********************************************

    const popupCreacion = () => {
        console.log("Creacion");
        setModoPopup('creacion');
        setShowPopup(true);
    }

    const popupModificacion = (id) => {
        console.log("modificacion");
        setModoPopup('modificacion');
        setidRobotMoficacion(id); 
        setShowPopup(true);
    }

  return (

        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">

            {/* Div con boton + Crear Robot */}
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Lista de Robots</h3>
                <button className="btn btn-primary" onClick={popupCreacion}>
                    <span className="material-icons mr-2">add</span> Nuevo Robot
                </button>
            </div>


            {/* Popup Creacion - modificacion nuevo robot */}
            {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                    {modoPopup === 'creacion' ? <h3 className="text-white text-lg font-semibold mb-4">Nuevo Robot</h3> : <h3 className="text-white text-lg font-semibold mb-4">{'Modicacion Robot: ' + idRobotMoficacion}</h3>}
                    <label className="block text-gray-300 mb-1">Nombre del robot</label>
                    <input
                        type="text"
                        value={nombreRobot}
                        onChange={(e) => setNombreRobot(e.target.value)}
                        className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                    />
                    <label className="block text-gray-300 mb-1">Tipo de robot</label>
                    <input
                        type="text"
                        value={tipoRobot}
                        onChange={(e) => setTipoRobot(e.target.value)}
                        className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                    />
                    <div className="flex justify-end space-x-2">
                        <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Cancelar</button>
                        <button className="btn btn-primary" onClick={ modoPopup === 'creacion' ? handleAddRobot : handleUpdateRobot}>Aceptar</button> 
                    </div>
                </div>
            </div>
            )}


            {/* ******************** Robot Visor ******************** */}
            <div className="card overflow-x-auto">
                <table className="min-w-full">

                    <thead>
                        <tr>
                            <th>Robot Name</th>
                            <th>Robot Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>


                        {robots.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center text-gray-400 py-4">No hay robots disponibles</td>
                        </tr>
                        ) : (
                        robots.map((robot) => (
                            <tr key={robot.id}>
                            <td className="text-white">{robot.nombre_robot}</td>
                            <td className="text-gray-300">{robot.tipo_robot}</td>
                            <td><span className="status-badge status-offline">Offline</span></td>
                            <td className="flex space-x-1">
                                <button className="btn-icon btn-secondary" onClick={() => {popupModificacion(robot.id)}} title="Modificar robot">
                                    <span className="material-icons text-base">edit</span>
                                </button>
                                <button className="btn-icon btn-danger" onClick={() => handleDeleteRobot(robot.id)} title="Eliminar robot">
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
  )
}

export default RobotVisor
