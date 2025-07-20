import React, { useEffect, useRef, useState } from "react";
import nipplejs from "nipplejs";
import "./styles.css";

const ManualMode = () => {
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

  return (
    <div className="manual-mode">
      <h3 className="manual-title">Modo Manual</h3>
      <div className="joystick-layout">
        <div className="joystick-container" ref={joystickRef}></div>
        <div className="velocidad-panel">
          <p><strong>Velocidad lineal:</strong> {velocidad.linear_x} m/s</p>
          <p><strong>Velocidad angular:</strong> {velocidad.angular_z} rad/s</p>
        </div>
      </div>
    </div>
  );
};

export default ManualMode;
