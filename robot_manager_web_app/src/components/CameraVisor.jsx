import React, { useEffect, useRef, useState } from 'react';
import Camera from '../assets/camera.png';


const CameraVisor = () => {
  const [status, setStatus] = useState('Conectando...');
  const [hasImage, setHasImage] = useState(false); // Nuevo estado
  const imgRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/image');

    socket.onopen = () => {
      setStatus('✅ Conectado al WebSocket');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'image' && data.image_data) {
          if (imgRef.current) {
            imgRef.current.src = `data:image/jpeg;base64,${data.image_data}`;
            setHasImage(true); // Marcar que hay imagen válida
          }
        }
      } catch (err) {
        console.error('❌ Error al procesar imagen:', err);
        setHasImage(false); // En caso de error, mostrar imagen por defecto
      }
    };

    socket.onclose = () => {
      setStatus('❌ WebSocket cerrado');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="component-card h-full">
      <div className="component-header">
        {
          hasImage ? (<span className="material-icons text-green-400">videocam</span>) : (<span className="material-icons text-red-400">videocam</span>)
        }
        
        <h3 className="component-title">Vista de Cámara</h3>
      </div>
      <div className="component-content h-full flex items-center justify-center bg-black">
        {hasImage ? (
          <img
            ref={imgRef}
            alt="Imagen del robot"
            style={{ maxWidth: '80vw', border: '2px solid #666' }}
          />
        ) : (
          <img
            className="w-full h-full object-cover"
            src={Camera}
            alt="Vista de cámara del robot (sin conexión)"
          />
        )}
      </div>
    </div>
  );
};

export default CameraVisor;
