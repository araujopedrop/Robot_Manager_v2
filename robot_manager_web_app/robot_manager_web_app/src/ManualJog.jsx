import React, { useEffect, useRef } from "react";
import nipplejs from "nipplejs";
import "./styles.css";

const ManualJog = () => {
  const joystickRef = useRef(null);
  const wsRef = useRef(null); // referencia al WebSocket

  useEffect(() => {
    // 1. Crear WebSocket (ajustá la IP/puerto según tu backend)
    wsRef.current = new WebSocket("ws://localhost:8000/ws/cmd_vel");

    // 2. Crear joystick
    const manager = nipplejs.create({
      zone: joystickRef.current,
      mode: "static",
      position: { left: "50%", top: "50%" },
      color: "blue",
      size: 150
    });

    // 3. Enviar valores por WebSocket en cada movimiento
    manager.on("move", (evt, data) => {
        if (data?.vector && wsRef.current?.readyState === WebSocket.OPEN) {
          const payload = {
            linear_x: data.vector.y,
            angular_z: data.vector.x
          };
          wsRef.current.send(JSON.stringify(payload));
        }
      });
      

    // 4. Opcional: detener el robot cuando se suelta el joystick
    manager.on("end", () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ linear_x: 0, angular_z: 0 }));
      }
    });

    // 5. Limpiar
    return () => {
      manager.destroy();
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div className="joystick-section">
      <h2>Control Manual</h2>
      <div className="joystick-container" ref={joystickRef}></div>
    </div>
  );
};

export default ManualJog;
