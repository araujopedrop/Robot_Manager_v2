import React from 'react';
import assignment from '../assets/assignment.svg';
import home from '../assets/home.svg';
import smart_toy from '../assets/smart_toy.svg';
import logout from '../assets/logout.svg';
import settings from '../assets/settings.svg';
import map from '../assets/map.svg';
import waypoints from '../assets/waypoints.svg';
import Logo from '../assets/Logo2.png';

const SideBar = ({ cambiarVista, vistaActual }) => {
  return (
    <aside className="w-64 bg-gray-800 p-5 flex flex-col h-screen">
      {/* Logo + título */}
      <div className="flex items-center mb-6">
        <img className="h-14 w-14 mr-3 rounded-full" src={Logo} alt="Robot Manager Logo" />
        <h1 className="text-2xl font-semibold text-white">Robot Manager</h1>
      </div>

      {/* Menú de navegación */}
      <nav className="flex flex-col space-y-3 pl-1">
        <button
          onClick={() => cambiarVista('inicio')}
          className={`sidebar-item flex items-center ${vistaActual === 'inicio' ? 'active' : ''}`}
        >
          <img src={home} alt="Inicio" className="h-6 w-6 mr-3" />
          Inicio
        </button>

        <button
          onClick={() => cambiarVista('mapas')}
          className={`sidebar-item flex items-center ${vistaActual === 'mapas' ? 'active' : ''}`}
        >
          <img src={map} alt="Mapas" className="h-6 w-6 mr-3" />
          Mapas
        </button>

        <button 
          onClick={() => cambiarVista('robots')}
          className={`sidebar-item flex items-center ${vistaActual === 'robots' ? 'active' : ''}`}>
          <img src={smart_toy} alt="Robots" className="h-6 w-6 mr-3" />
          Robots
        </button>

        <button 
          onClick={() => cambiarVista('misiones')}
          className={`sidebar-item flex items-center ${vistaActual === 'misiones' ? 'active' : ''}`}>
          <img src={assignment} alt="Misiones" className="h-6 w-6 mr-3" />
          Misiones
        </button>

        <button 
          onClick={() => cambiarVista('waypoints')}
          className={`sidebar-item flex items-center ${vistaActual === 'waypoints' ? 'active' : ''}`}>
          <img src={waypoints} alt="Waypoints" className="h-6 w-6 mr-3" />
          Waypoints
        </button>

        <button 
          onClick={() => cambiarVista('configuracion')}
          className={`sidebar-item flex items-center ${vistaActual === 'configuracion' ? 'active' : ''}`}>
          <img src={settings} alt="Configuración" className="h-6 w-6 mr-3" />
          Configuración
        </button>

      </nav>

      {/* Botón logout al final */}
      <div className="mt-auto pl-2">
        <button 
        onClick={() => cambiarVista('logout')}
        className={`sidebar-item flex items-center ${vistaActual === 'logout' ? 'active' : ''}`}>
          <img src={logout} alt="Logout" className="h-6 w-6 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
