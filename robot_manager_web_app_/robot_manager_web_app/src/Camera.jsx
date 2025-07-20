import React, { useEffect, useRef, useState } from 'react';

export const Camera = () => {
  const [status, setStatus] = useState('Conectando...');
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
          imgRef.current.src = `data:image/jpeg;base64,${data.image_data}`;
        }
      } catch (err) {
        console.error('❌ Error al procesar imagen:', err);
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
    <div style={{ textAlign: 'center', backgroundColor: '#111', color: '#eee' }}>
      <img
        ref={imgRef}
        alt="Imagen del robot"
        style={{ maxWidth: '80vw', border: '2px solid #666' }}
      />
    </div>
  );
};

export default Camera;