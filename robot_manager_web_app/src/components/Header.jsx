import React from 'react'
import { useAuth } from '../components/AuthContext';  // o '../context/AuthContext' según tu estructura

const Header = () => {

  const { usuario, cargando, logout } = useAuth();


  return (
    <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div><h2 className="text-xl font-semibold text-white">Inicio</h2></div>
      <div className="flex items-center">
        <div className="mr-6">
          <span className="text-gray-400 text-sm">Robot Seleccionado:</span>
          <div className="flex items-center mt-1">
            <span className="material-icons text-green-500 mr-1">smart_toy</span>
            <span className="text-white font-medium">Robot Alpha 1</span>
            <span className="ml-2 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">Conectado</span>
          </div>
        </div>
        <span className="text-gray-400 mr-3">Usuario: {usuario.nombre}</span>
      </div>
    </header>
  )
}


export default Header;