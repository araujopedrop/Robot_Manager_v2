
import React, { useEffect, useRef, useState } from "react";

const MapaROS = ({ nombrePlanta, nombreMapa }) => {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);
  const [visible, setVisible] = useState(true);

  const nombreCompleto = `${nombrePlanta}_${nombreMapa}`;

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const socket = new WebSocket("ws://localhost:8000/ws/map");

    socket.onopen = () => {
      console.log("✅ Conectado a /ws/map");
      socket.send("ping");
    };

    socket.onmessage = (event) => {
      const map = JSON.parse(event.data);
      console.log("🗺️ Mapa recibido:", map);

      const scale = 4 * zoom;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(offset.x + canvas.width / 2, offset.y + canvas.height / 2);
      ctx.rotate(angle);

      for (let i = 0; i < map.data.length; i++) {
        const value = map.data[i];
        const col = i % map.width;
        const row = Math.floor(i / map.width);

        let color = "#ccc";
        if (value === 0) color = "#fff";
        if (value === 100) color = "#000";

        ctx.fillStyle = color;
        ctx.fillRect(
          (col - map.width / 2) * scale,
          (row - map.height / 2) * scale,
          scale,
          scale
        );
      }

      ctx.restore();
    };

    return () => socket.close();
  }, [zoom, offset, angle, visible]);

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.ctrlKey) {
      setAngle((prev) => prev + e.deltaY * 0.001);
    } else {
      setZoom((prev) => Math.max(0.1, prev - e.deltaY * 0.001));
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      setLastPos({ x: e.clientX, y: e.clientY });
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    }
  };

  const handleMouseUp = () => setDragging(false);

  const handleFinishMapping = async () => {
    console.log("Guardando mapa");
    try {
      const save = await fetch("http://localhost:8000/start-map-saver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreCompleto })
      });
      const saveData = await save.json();
      console.log("💾 Mapa guardado como:", nombreCompleto, saveData);

      const stop = await fetch("http://localhost:8000/stop-mapping", {
        method: "POST"
      });
      const stopData = await stop.json();
      console.log("🛑 Mapeado detenido:", stopData);

      // Ver de destruirse, no de ocultarse
      setVisible(false);
    } catch (err) {
      console.error("❌ Error al guardar y finalizar:", err);
    }
  };

  if (!visible) return null;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <h2>Mapa actual: {nombreCompleto}</h2>
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        style={{
          border: "1px solid black",
          backgroundColor: "#eee",
          cursor: dragging ? "grabbing" : "grab"
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      />
      <button
        onClick={handleFinishMapping}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          padding: "10px 16px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.3)"
        }}
      >
        Finalizar y guardar
      </button>
    </div>
  );
};

export default MapaROS;