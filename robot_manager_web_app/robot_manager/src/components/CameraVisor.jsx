import React, { useEffect, useRef, useState } from 'react';
import Camera from '../assets/camera.png';
import cameraOn from '../assets/cameraOn.svg';
import cameraOff from '../assets/cameraOff.svg';

const CameraVisor = () => {
  const [status, setStatus] = useState('Conectando...');
  const [hasImage, setHasImage] = useState(false);
  var imgRef = useRef({ src: "" });


  // --- Watchdog para pérdida de frames ---
  const STALE_MS = 3000; // 3 segundos sin recibir frames
  const staleTimerRef = useRef(null);

  var flag_imagen = true;

  const clearStaleTimer = () => {
    if (staleTimerRef.current) {
      clearTimeout(staleTimerRef.current);
      staleTimerRef.current = null;
    }
  };

  const armStaleTimer = () => {
    clearStaleTimer();
    staleTimerRef.current = setTimeout(() => {
      // Si no se reciben frames en 3 segundos:
      setHasImage(false);
      flag_imagen = true;
      //setStatus('⚠️ Sin datos de cámara (timeout 3s)');
    }, STALE_MS);
  };

  // --- WebSocket principal ---
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/image');

    socket.onopen = () => {
      setStatus('');
      armStaleTimer(); // empieza el contador
    };

    socket.onmessage = (event) => {
      try {
        
        const data = JSON.parse(event.data);

        if (data.type === 'image' && data.image_data) {
          const setSrc = () => {
            if (imgRef.current) {
              imgRef.current.src = `data:image/jpeg;base64,${data.image_data}`;
              setHasImage(true);
            }
          };

          if (!imgRef.current) {
            setHasImage(true);              // monta el <img ref=...>
            requestAnimationFrame(setSrc);  // y luego setea el src
          } else {
            setSrc();
          }

          armStaleTimer();
        }

      } catch (err) {
        console.error('❌ Error al procesar imagen:', err);
        setHasImage(false);
      }
    };

    socket.onerror = () => {
      //setStatus('⚠️ Error en WebSocket');
    };

    socket.onclose = () => {
      clearStaleTimer();
      setHasImage(false);
      //setStatus('❌ WebSocket cerrado');
    };

    return () => {
      clearStaleTimer();
      socket.close();
    };
  }, []);

  // --- Render ---
  return (
    <div className="component-card h-full">
      <div className="component-header">
        {hasImage ? (
          <img src={cameraOn} alt="VideoCamaraOn" className="w-6 h-6" />
        ) : (
          <img src={cameraOff} alt="VideoCamaraOff" className="w-6 h-6" />
        )}
        <h3 className="component-title">Vista de Cámara</h3>
        <span className="ml-auto text-xs opacity-70">{status}</span>
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
