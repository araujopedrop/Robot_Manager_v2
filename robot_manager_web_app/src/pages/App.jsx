import React, { useState, useEffect } from 'react';
import SideBar from '../components/sideBar';
import ManAutoSection from './ManAutoSection';
import MapSection from './MapSection';
import RobotSection from './RobotSection';
import MissionSection from './MissionSection';
import ConfigSection from './ConfigSection';
import HomeSection from './HomeSection';
import Login from './login';

const App = () => {
  const [vistaActual, setVistaActual] = useState();
  const [usuarioLogueado, setUsuarioLogueado] = useState(null); // null = aún no cargó, false = no hay sesión

  // Verificamos si hay sesión activa al cargar
  useEffect(() => {
    fetch('http://localhost:8000/check-auth', {
      credentials: 'include' // necesario si usás cookies
    })
      .then(res => res.json())
      .then(data => {
        if (data.autenticado) {
          setUsuarioLogueado(true);
        } else {
          setUsuarioLogueado(false);
        }
      })
      .catch(err => {
        console.error('Error al verificar autenticación:', err);
        setUsuarioLogueado(false);
      });
  }, []);

  const renderVista = () => {
    const bt_inicio = 'inicio';
    const bt_mapas = 'mapas';
    const bt_robots = 'robots';
    const bt_misiones = 'misiones';
    const bt_configuracion = 'configuracion';

    switch (vistaActual) {
      case bt_inicio:
        return <ManAutoSection />;
      case bt_mapas:
        return <MapSection />;
      case bt_robots:
        return <RobotSection />;
      case bt_misiones:
        return <MissionSection />;
      case bt_configuracion:
        return <ConfigSection />;
      default:
        return <HomeSection />;
    }
  };

  if (usuarioLogueado === null) {
    return <div className="flex items-center justify-center h-screen text-white">Cargando...</div>;
  }

  if (!usuarioLogueado) {
    return <Login onLoginSuccess={() => setUsuarioLogueado(true)} />;
  }

  return (
    <div className="flex h-screen">
      <SideBar cambiarVista={setVistaActual} vistaActual={vistaActual} />
      <div className="flex-1 overflow-hidden">
        {renderVista()}
      </div>
    </div>
  );
};

export default App;
