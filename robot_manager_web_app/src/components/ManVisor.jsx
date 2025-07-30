import React, { useEffect, useRef, useState }  from 'react'
import nipplejs from "nipplejs";

const ManVisor = () => {

  const joystickRef = useRef(null);
  const wsRef = useRef(null);
  const [velocidad, setVelocidad] = useState({ linear_x: 0, angular_z: 0 });


  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8000/ws/cmd_vel");
    const odomWs = new WebSocket("ws://localhost:8000/ws/odom");

    odomWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setVelocidad({
        linear_x: data.linear_x?.toFixed(2) || 0,
        angular_z: data.angular_z?.toFixed(2) || 0,
      });
    };

    const manager = nipplejs.create({
      zone: joystickRef.current,
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "blue",
      size: 150,
    });

    manager.on("move", (evt, data) => {
      if (data?.vector && wsRef.current?.readyState === WebSocket.OPEN) {
        const payload = {
          linear_x: data.vector.y,
          angular_z: data.vector.x,
        };
        wsRef.current.send(JSON.stringify(payload));
      }
    });

    manager.on("end", () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ linear_x: 0, angular_z: 0 }));
      }
    });

    return () => {
      manager.destroy();
      if (wsRef.current) wsRef.current.close();
      odomWs.close();
    };
  }, []);



  const handleButtonEmergency = async () => {
    console.log("handleButtonEmergency");
    
    try {

      const stop = await fetch("http://localhost:8000/Emergency", {
        method: "POST",
        credentials: "include"
      });
      const stopData = await stop.json();
      console.log("🛑 handleButtonEmergency pressed:", stopData);

    } catch (err) {
      console.error("❌ Error al detener:", err);
    }
    
  };



  return (
    <div className="component-card lg:col-span-3">
        <div className="component-content !p-6">

            <div id="manual-panel">

                <p className="text-gray-400 mb-4 text-center">Usa el joystick para mover el robot.</p>

                <div className="flex justify-around flex-wrap items-start">

                    {/* Joystick */}
                    
                    <div className="joystick-base mb-4">
                        <div className="joystick-stick">
                            {/* <div className="joystick-stick-center"></div> */}
                            <div className="joystick-container" ref={joystickRef}></div>
                        </div>
                    </div>
                    

                    {/* Visor velocidades */}
                    <div className="space-y-4">
                        <div className="velocity-display">
                            <div className="velocity-label">Velocidad Lineal</div>
                            <div className="velocity-value">{velocidad.linear_x} <span className="text-sm text-gray-400">m/s</span></div>
                        </div>
                        <div className="velocity-display">
                            <div className="velocity-label">Velocidad Angular</div>
                            <div className="velocity-value">{velocidad.angular_z} <span className="text-sm text-gray-400">rad/s</span></div>
                        </div>
                    </div>

                </div>

                {/* Boton de emergencia */}
                <div className="flex justify-center mt-4">
                    <button 
                        onClick={handleButtonEmergency}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center">
                        <span className="material-icons mr-2">stop_circle</span> Parada de Emergencia
                    </button>
                </div>

            </div>

            <div id="auto-panel" className="hidden">
                <div className="mb-4">
                    <label htmlFor="mission-select" className="block text-sm font-medium text-gray-300 mb-1">Seleccionar Misión:</label>
                    <select id="mission-select" className="block w-full bg-gray-700 text-white p-2.5 rounded-md">
                        <option>Misión 1: Patrulla Sector A</option>
                        <option>Misión 2: Escaneo Área de Carga</option>
                        <option>Misión 3: Regreso a Base</option>
                        <option>Misión 4: Ir a Estación de Carga</option>
                    </select>
                </div>
                <ul className="divide-y divide-gray-600/70 bg-gray-700/50 rounded-lg max-h-60 overflow-y-auto">
                    <li className="action-item"><div className="flex items-center"><span className="material-icons action-item-icon">play_circle_outline</span><span className="action-item-text">Iniciar Patrulla</span></div><div className="status-circle bg-green-500"></div></li>
                    <li className="action-item"><div className="flex items-center"><span className="material-icons action-item-icon">sync</span><span className="action-item-text">Escanear Área</span></div><div className="status-circle-empty"></div></li>
                </ul>
                <div className="flex justify-around mt-6 space-x-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg flex items-center"><span className="material-icons mr-2">play_arrow</span> Iniciar</button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg flex items-center"><span className="material-icons mr-2">stop</span> Detener</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg flex items-center"><span className="material-icons mr-2">stop_circle</span> Parada</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ManVisor;