import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';

const Header = () => {
  const { usuario, cargando, logout } = useAuth();
  const [robots, setRobots] = useState([]);
  const [robotSeleccionado, setRobotSeleccionado] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/robots", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setRobots(data);
        if (data.length > 0) {
          setRobotSeleccionado(data[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);


  const robotActivo = robots.find(r => r.id === robotSeleccionado); 

  return (
    <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-white">Inicio</h2>
      </div>

      <div className="flex items-center space-x-6">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Robot Seleccionado:</label>
          {robots.length === 0 ? (
            <div className="text-gray-400 text-sm">Sin robots disponibles</div>
          ) : (
            <div>
              <select
                value={robotSeleccionado}
                onChange={(e) => setRobotSeleccionado(Number(e.target.value))}
                className="bg-gray-700 text-white text-sm rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {robots.map((robot) => (
                  <option key={robot.id} value={robot.id}>
                    {robot.nombre_robot}
                  </option>
                ))}
              </select>

              {/* Mostrar estado del robot */}
              {robotActivo && (
                <div className="mt-2 text-sm text-white">
                  Estado:{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      robotActivo.status_robot === 'Online'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {robotActivo.status_robot}
                  </span>
                </div>
              )}

            </div>
          )}
        </div>

        <div className="text-gray-400 text-sm">
          Usuario: <span className="text-white font-semibold">{usuario.nombre}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
