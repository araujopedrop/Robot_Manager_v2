import React, {useState, useEffect} from 'react'

import List from '../assets/list.svg';



const MissionVisor = () => {

    const [missions, setMissions] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [missionName, setMissionName] = useState("");
    const [millName, setMillName] = useState("");
    const [missionStatus, setMissionStatus] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [modoPopup, setModoPopup] = useState('creacion');
    const [idMissionUpdate, setIdMissionUpdate] = useState(-1);
    const [nameMissionUpdate, setNameMissionUpdate] = useState("");
    const [tasksMissionUpdate, setTasksMissionUpdate] = useState("");
    const [missionUpdate, setMissionUpdate] = useState();
    const [tasks, setTasks] = useState([]);
    const [invalidTaskIds, setInvalidTaskIds] = useState([]);
    const [waypoints, setWaypoints] = useState([]);

    const nullTask = "nullTask";

    // ********************************************* CRUD MISSION ENDPOINTS *********************************************


    // Get maps
    useEffect(() => {
        fetch("http://localhost:8000/missions", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setMissions(data))
        .catch((err) => console.error(err));
    
        getWaypoints();
        console.log(waypoints);
    
    }, []);

    // Create Mission
    const handleAddMission = () => {
    const nuevo = {
        mission_name: missionName,
        mill_name: millName,        
        mission_status: "Inactiva",
        start_time: "--- ---",
        end_time: "--- ---",
        tasks: []
    };
    fetch("http://localhost:8000/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(nuevo),
    })
        .then((res) => res.json())
        .then((data) => {
        setMissions([...missions, { ...nuevo, id: data.id }]);
        setMissionName("");
        setMillName("");
        setMissionStatus("");
        setStartTime("");        
        setEndTime("");
        setShowPopup(false);
        })
        .catch((err) => {
            console.error("❌ Error Create Mission:", err);

            // Limpiar estados
            setMissionName("");
            setMillName("");
            setMissionStatus("");
            setStartTime("");        
            setEndTime("");
            setShowPopup(false);

            alert("Error Create Mission. Verify connection.");

        });
    };

    // Update Mission
    const handleUpdateMission = () => {

    const modificacion = {
        mission_name: missionName,
        mill_name: millName,        
        mission_status: missionStatus,
        start_time: startTime,
        end_time: endTime,
    };

    fetch(`http://localhost:8000/missions/${idMissionUpdate}`, {
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

        setMissions(missions.map((mission) => 
            mission.id === idMissionUpdate ? { ...mission, ...modificacion } : mission
        ));

        // Limpiar estados
        setMissionName("");
        setNameMissionUpdate("");
        setMillName("");
        setMissionStatus("");
        setStartTime("");        
        setEndTime("");
        setShowPopup(false);
    })
    .catch((err) => {
        console.error("❌ Error Update Mission:", err);

        // Limpiar estados
        setMissionName("");
        setNameMissionUpdate("");
        setMillName("");
        setMissionStatus("");
        setStartTime("");        
        setEndTime("");
        setShowPopup(false);

        alert("Error Update Mission. Verify connection.");

    });
    }

    // Delete Mission
    const handleDeleteMission = (id) => {
    fetch(`http://localhost:8000/missions/${id}`, {
        method: "DELETE",
        credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "deleted") {
                setMissions(missions.filter((m) => m.id !== id));
            }
        });
    };

    // ********************************************* CRUD MISSION ENDPOINTS *********************************************

    // ********************************************* CRUD TASKS ENDPOINTS *********************************************

    // Create Task
    const handleAddTask = () => {

        const nuevoNumero = tasks.length === 0
            ? 1
            : Math.max(...tasks.map(t => t.numero)) + 1;


        const nuevoTask = {
            id: Date.now(),
            task: "",
            numero: nuevoNumero,
            arg1: "",
        };

        setTasks(prev => [...prev, nuevoTask]);
    };

    const handleTaskChange = (id, nuevoTipo) => {
        setTasks(prev =>
            prev.map(task =>
            task.id === id ? { ...task, task: nuevoTipo } : task
            )
        );
    };

    const handleUpdateTask = (id) => {

    }

    // Delete Task
    const handleDeleteTask = (id) => {
        const nuevasTasks = tasks
            .filter(task => task.id !== id)
            .map((task, index) => ({ ...task, numero: index + 1 }));

        setTasks(nuevasTasks);
    };


    // ********************************************* CRUD TASKS ENDPOINTS *********************************************

    // ********************************************* WAYPOINTS ENDPOINTS *********************************************

    const getWaypoints = () => {
        fetch("http://localhost:8000/waypoints", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setWaypoints(data))
            .catch((err) => console.error(err));
        
    }

    // ********************************************* WAYPOINTS ENDPOINTS *********************************************
    


    // ************************************************* POPUP FUNCS *************************************************

    const popupCreacion = () => {
        setModoPopup('creacion');
        setShowPopup(true);
    }

    const popupModificacion = (mission) => {
        setModoPopup('modificacion');

        // Get mission info
        setIdMissionUpdate(mission.id); 
        setNameMissionUpdate(mission.mission_name); 
        setMillName(mission.mill_name);
        setMissionStatus(mission.mission_status);
        setStartTime(mission.start_time);
        setEndTime(mission.end_time);
        setTasksMissionUpdate(mission.tasks);

        setShowPopup(true);
    }

    const popupActions = (mission) => {

        setModoPopup('actions');
        console.log(waypoints);

        // Get mission info
        setTasks(mission.tasks || []);
        setMissionUpdate(mission);

        setIdMissionUpdate(mission.id); 
        setNameMissionUpdate(mission.mission_name); 
        setMillName(mission.mill_name);
        setMissionStatus(mission.mission_status);
        setStartTime(mission.start_time);
        setEndTime(mission.end_time);
        setTasksMissionUpdate(mission.tasks);

        setShowPopup(true);
    }

    const handleAddActions = () => {
        const tareasInvalidas = tasks.filter(task => {
        if (task.task === "") return true;
        if (task.arg1 === "") return true;

        if (task.task === "Esperar") {
            const valor = parseFloat(task.arg1);
            if (isNaN(valor) || valor <= 0 || valor > 60) return true;
        }

        return false;
        });

        const idsInvalidos = tareasInvalidas.map(t => t.id);

        if (idsInvalidos.length > 0) {
            //console.warn("❌ Hay tareas inválidas:", idsInvalidos);
            setInvalidTaskIds(idsInvalidos);
            alert("Hay tareas sin completar");
            return;
        }

        // Si todo está bien, limpiar errores anteriores y guardar
        setInvalidTaskIds([]);

        const modificado = {
            mission_name: nameMissionUpdate,
            mill_name: millName,        
            mission_status: missionStatus,
            start_time: startTime,
            end_time: endTime,
            tasks: tasks,
        };

        fetch(`http://localhost:8000/missions/${idMissionUpdate}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(modificado),
        })
        .then(res => res.json())
        .then(() => {
            setMissions(prev =>
                prev.map((m) =>
                    m.id === idMissionUpdate ? { ...m, tasks: tasks } : m
                )
            );
            setShowPopup(false);
        })
        .catch(err => {
            console.error("❌ Error actualizando tareas:", err);
            alert("Error al guardar las tareas");
        });
    };

    const handleChange = (e) => {
        setTaskTipe(e.target.value);
        console.log('Opción seleccionada:', e.target.value);
    };

    // ************************************************* POPUP FUNCS *************************************************

  return (

        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
        
            {/* Div con boton + Crear Mapa */}
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Listado de Misiones</h3>
                <button className="btn btn-primary" onClick={popupCreacion}>
                    <span className="material-icons mr-2">add</span> Nueva Misión
                </button>
            </div>

            {/* Popup misiones y acciones */}
            {showPopup && (
                modoPopup === 'actions' ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">

                            {/* Titulo popup tasks */}
                            <div className="mb-6 flex justify-between items-center">
                                <h3 className="text-white text-lg font-semibold mb-4"> {'Mision: ' + nameMissionUpdate} </h3>
                                <button className="btn btn-primary" onClick={handleAddTask}>
                                    <span className="material-icons mr-2">add</span> Nuevo Task
                                </button>
                            </div>

                            {/* Tabla tasks */}
                            <table className="min-w-full table-auto border border-gray-700 text-white">

                                {/* HEAD Tabla tasks */}
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="p-2">Numero</th>
                                        <th className="p-2">Tarea</th>
                                        <th className="p-2">Acciones</th>
                                    </tr>
                                </thead>

                                {/* BODY Tabla tasks */}
                                <tbody>                                    
                                    {tasks.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center text-gray-400 py-4">No hay tareas asignadas</td>
                                        </tr>
                                    ) : (
                                        tasks.map((task) => (
                                            <tr key={task.id} className={invalidTaskIds.includes(task.id) ? "bg-red-900" : ""}>
                                                <td className="border border-gray-600 px-4 py-2">{task.numero}</td>
                                                <td className="p-2 border">
                                                    <div className="flex space-x-2">
                                                        {/* Dropdown tipo de tarea */}
                                                        <select
                                                            value={task.task}
                                                            onChange={(e) => handleTaskChange(task.id, e.target.value)}
                                                            className="bg-gray-700 text-white p-2 rounded w-full"
                                                        >
                                                            <option value="">Seleccionar opción</option>
                                                            <option value="Ir a">Ir a:</option>
                                                            <option value="Esperar">Esperar:</option>
                                                        </select>

                                                        {/* Dropdown adicional condicional */}
                                                        {task.task === "Ir a" && (
                                                        <select
                                                            value={task.arg1}
                                                            onChange={(e) => {
                                                                const nuevoArg1 = e.target.value;
                                                                setTasks(prev =>
                                                                    prev.map(t =>
                                                                    t.id === task.id ? { ...t, arg1: nuevoArg1 } : t
                                                                    )
                                                                );
                                                            }}
                                                            className="bg-gray-700 text-white p-2 rounded"
                                                        >
                                                            <option value="">Elegir destino</option>
                                                            {waypoints.map((wp) => (
                                                                <option key={wp.id} value={wp.waypoint_name}>{wp.waypoint_name}</option>
                                                            ))}
                                                        </select>
                                                        )}

                                                        {task.task === "Esperar" && (
                                                        <input
                                                            type="text"
                                                            value={task.arg1}
                                                            placeholder="Ej: 10s"
                                                            onChange={(e) => {
                                                            const nuevoArg1 = e.target.value;
                                                            setTasks(prev =>
                                                                prev.map(t =>
                                                                t.id === task.id ? { ...t, arg1: nuevoArg1 } : t
                                                                )
                                                            );
                                                            setInvalidTaskIds(prev => prev.filter(tid => tid !== task.id));
                                                            }}
                                                            className="bg-gray-700 text-white p-2 rounded w-full"
                                                        />
                                                        )}
                                                    </div>
                                                </td>
                                                
                                                <td className="flex space-x-1 border border-gray-600">
                                                    <button
                                                        className="btn-icon btn-secondary"
                                                        onClick={() => handleUpdateTask(task.id)}
                                                        title="Modificar Task"
                                                    >
                                                        <span className="material-icons text-base">edit</span>
                                                    </button>
                                                    <button
                                                        className="btn-icon btn-danger"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        title="Eliminar task"
                                                    >
                                                        <span className="material-icons text-base">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>

                            </table>

                            <div className="flex justify-end space-x-2">
                                <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleAddActions()}
                                >
                                    Aceptar
                                </button>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                            {modoPopup === 'creacion' ? ( <h3 className="text-white text-lg font-semibold mb-4">Nueva mision</h3>) : (
                                <h3 className="text-white text-lg font-semibold mb-4"> {'Modicacion Mision: ' + nameMissionUpdate} </h3>
                            )}
                            <label className="block text-gray-300 mb-1">Nombre de mision</label>
                            <input
                                type="text"
                                value={missionName}
                                onChange={(e) => setMissionName(e.target.value)}
                                className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
                            />
                                <label className="block text-gray-300 mb-1">Nombre de planta</label>
                            <input
                                type="text"
                                value={millName}
                                onChange={(e) => setMillName(e.target.value)}
                                className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                            />
                            <div className="flex justify-end space-x-2">
                                <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={modoPopup === 'creacion' ? handleAddMission : handleUpdateMission}
                                >
                                    Aceptar
                                </button>
                            </div>

                        </div>
                    </div>
                )
            )}


            {/* Listado mapas */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                <table className="min-w-full">

                    <thead>
                        <tr>
                            <th>Nombre de Misión</th>
                            <th>Planta</th>
                            <th>Estado</th>
                            <th>Inicio / Fin</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>

                        {missions.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="no-maps">No hay misiones disponibles</td>
                            </tr>
                        ) : (
                            missions.map((mission) => (
                            <tr key={mission.id}>
                                <td>{mission.mission_name}</td>
                                <td>{mission.mill_name}</td>
                                <td>
                                    {mission.mission_status === 'Inactiva' ? (
                                        <span className="status-badge status-inactive">
                                        {mission.mission_status}
                                        </span>
                                    ) : mission.mission_status === 'En progreso' ? (
                                        <span className="status-badge status-inprogress">
                                        {mission.mission_status}
                                        </span>
                                        ) : mission.mission_status === 'Error' ? (
                                        <span className="status-badge status-error">
                                        {mission.mission_status}
                                        </span>
                                            ) : (
                                                <span className="status-badge status-completed">
                                                {mission.mission_status}
                                                </span>
                                            )
                                    }
                                </td>
                                <td>
                                    <div className="flex flex-col">
                                        <span>{mission.start_time}</span>
                                        <span>{mission.end_time}</span>
                                    </div>
                                </td>
                                <td className="flex space-x-1">
                                    <button className="btn-icon btn-secondary" onClick={() => popupModificacion(mission)} title="Modificar mision">
                                        <span className="material-icons text-base">edit</span>
                                    </button>
                                    <button className="btn-icon btn-secondary" onClick={() => popupActions(mission)} title="Modificar tasks">
                                        <img src={List} alt="act" className="w-8 h-8" />
                                    </button>
                                    <button className="btn-icon btn-danger" onClick={() => handleDeleteMission(mission.id)} title="Eliminar mision">
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

export default MissionVisor
