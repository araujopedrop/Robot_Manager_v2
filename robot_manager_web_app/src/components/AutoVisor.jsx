import React, { useEffect, useRef, useState } from 'react'
import play_arrow from '../assets/play_arrow.svg'
import stop from '../assets/stop.svg'
import stop_circle from '../assets/stop_circle.svg'

const AutoVisor = () => {

  const [waypoints, setWaypoints] = useState([]);
  const [missions, setMissions] = useState([]);
  const [robots, setRobots] = useState([]);
  const [selectedMissionId, setSelectedMissionId] = useState("");

  // Get data al iniciar
  useEffect(() => {
    fetch("http://localhost:8000/missions", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setMissions(data))
      .catch((err) => console.error(err));

    getWaypoints();

    fetch("http://localhost:8000/robots", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRobots(data))
      .catch((err) => console.error(err));

  }, []);

  const getWaypoints = () => {
    fetch("http://localhost:8000/waypoints", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setWaypoints(data))
      .catch((err) => console.error(err));
  }

  const selectedMission = missions.find(m => m.id === parseInt(selectedMissionId));

  return (
    <div className="component-content !p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        <div className="md:col-span-2 space-y-4">

          {/* Selector misión */}
          <div>

            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="mission-select">
              Seleccionar Misión:
            </label>

            <select
              className="block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5"
              id="mission-select"
              name="mission-select"
              value={selectedMissionId}
              onChange={(e) => setSelectedMissionId(e.target.value)}
            >
              {/*<option value="">Seleccionar misión</option>*/}
              {missions.length === 0 ? (
                <option disabled>No hay misiones para asignar</option>
              ) : (
                missions.map((mission) => (
                  <option key={mission.id} value={mission.id}>
                    {`Misión ${mission.id}: ${mission.mission_name}`}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Visor tareas */}
          <div className="bg-gray-700/50 rounded-lg max-h-60 overflow-y-auto">
            <ul className="divide-y divide-gray-600/70">
              {selectedMission ? (
                selectedMission.tasks.map((task) => (
                  <li key={task.id} className="action-item">
                    <div className="flex items-center">
                      <span className="material-icons action-item-icon">check_circle</span>
                      <span className="action-item-text">{`${task.task} → ${task.arg1}`}</span>
                    </div>
                    <div className="status-circle-empty"></div>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-400 py-4">
                  No hay tareas para mostrar
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Botones de acción */}
        <div className="md:col-span-1 flex flex-col justify-between h-full mt-7 space-y-4">
          <div className="space-y-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center w-full justify-center">
              <img className="w-8 h-8" src={play_arrow} alt="Iniciar Misión" />
              <h3 className="component-title">Iniciar Misión</h3>
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg flex items-center w-full justify-center">
              <img className="w-8 h-8" src={stop} alt="Detener Misión" />
              <h3 className="component-title">Detener Misión</h3>
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center w-full justify-center">
              <img className="w-8 h-8" src={stop_circle} alt="Parada de Emergencia" />
              <h3 className="component-title">Parada de Emergencia</h3>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AutoVisor;
