import React , { useEffect, useState }  from 'react'

const RobotVisor = () => {

    const [robots, setRobots] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [nombreRobot, setNombreRobot] = useState("");
    const [tipoRobot, setTipoRobot] = useState("");
    const [statusRobot, setStatusRobot] = useState("");
    const [mostrarRobot, setMostrarRobot] = useState(false);

    // Get robots
    useEffect(() => {
    fetch("http://localhost:8000/robots")
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


    // Delete Robot
    const handleDeleteRobot = (id) => {
    fetch(`http://localhost:8000/robots/${id}`, {
        method: "DELETE",
    })
        .then((res) => res.json())
        .then((data) => {
        if (data.status === "deleted") {
            setRobots(robots.filter((m) => m.id !== id));
        }
        });
    };

  return (

        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">

            {/* Div con boton + Crear Robot */}
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Lista de Robots</h3>
                <button className="btn btn-primary" onClick={() => setShowPopup(true)}>
                    <span className="material-icons mr-2">add</span> Nuevo Robot
                </button>
            </div>


        {/* Popup Creacion nuevo robot */}
        {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-white text-lg font-semibold mb-4">Nuevo Robot</h3>
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
                    <button className="btn btn-primary" onClick={handleAddRobot}>Aceptar</button>
                </div>
            </div>
        </div>
        )}


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
                                <button className="btn-icon btn-secondary" onClick={() => handleEditRobot(robot.id)} title="Modificar robot">
                                    <span className="material-icons text-base">edit</span>
                                </button>
                                <button className="btn-icon btn-danger" onClick={() => handleDeleteRobot(robot.id)} title="Eliminar robot">
                                    <span className="material-icons text-base">delete</span>
                                </button>
                            </td>
                            </tr>
                        ))
                        )}

                        {/* 
                        <tr>
                            <td className="text-white">Robot Alpha 1</td>
                            <td className="text-gray-300">Móvil Terrestre</td>
                            <td><span className="status-badge status-online">Online</span></td>
                            <td className="flex space-x-2">
                                <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                                    <span className="material-icons text-sm">edit</span>
                                </button>
                                <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-white">Robot Beta 7</td>
                            <td className="text-gray-300">Dron Aéreo</td>
                            <td><span className="status-badge status-offline">Offline</span></td>
                            <td className="flex space-x-2">
                                <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                                    <span className="material-icons text-sm">edit</span>
                                </button>
                                <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-white">Robot Gamma 3</td>
                            <td className="text-gray-300">Manipulador Industrial</td>
                            <td><span className="status-badge status-maintenance">En Mantenimiento</span></td>
                            <td className="flex space-x-2">
                                <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                                    <span className="material-icons text-sm">edit</span>
                                </button>
                                <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-white">Robot Delta 9</td>
                            <td className="text-gray-300">Móvil Acuático</td>
                            <td><span className="status-badge status-online">Online</span></td>
                            <td className="flex space-x-2">
                                <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                                    <span className="material-icons text-sm">edit</span>
                                </button>
                                <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td className="text-white">Robot Epsilon 2</td>
                            <td className="text-gray-300">Humanoide</td>
                            <td><span className="status-badge status-offline">Offline</span></td>
                            <td className="flex space-x-2">
                                <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                                    <span className="material-icons text-sm">edit</span>
                                </button>
                                <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </td>
                        </tr>

                        */}

                    </tbody>

                </table>
            </div>

        </div>
  )
}

export default RobotVisor
