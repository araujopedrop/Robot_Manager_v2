import React, { useState } from 'react';
import SideBar from '../components/sideBar';
import HomeSection from './HomeSection';
import ManAutoSection from './ManAutoSection';
import MapSection from './MapSection';
import RobotSection from './RobotSection';
import MissionSection from './MissionSection';
import WaypointsSection from './WaypointsSection';
import ConfigSection from './ConfigSection';
import Login from './login';
import Register from '../components/Register';
import { useAuth } from '../components/AuthContext';

const App = () => {
  const [vistaActual, setVistaActual] = useState();
  const [modoAuth, setModoAuth] = useState('login');
  const { usuario, cargando, logout } = useAuth();

  const renderVista = () => {
    switch (vistaActual) {
      case 'inicio': return <ManAutoSection />;
      case 'mapas': return <MapSection />;
      case 'robots': return <RobotSection />;
      case 'misiones': return <MissionSection />;
      case 'waypoints': return <WaypointsSection />;
      case 'configuracion': return <ConfigSection />;
      case 'logout': 
        logout();
        return <HomeSection />;
      default: return <HomeSection />;
    }
  };

  if (cargando) {
    return <div className="flex items-center justify-center h-screen text-white">Cargando sesión...</div>;
  }

  if (!usuario) {
    return modoAuth === 'login' ? (
      <Login
        onLoginSuccess={() => window.location.reload()}
        onSwitchToRegister={() => setModoAuth('register')}
      />
    ) : (
      <Register
        onRegisterSuccess={() => setModoAuth('login')}
      />
    );
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
