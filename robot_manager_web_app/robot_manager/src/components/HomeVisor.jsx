import React from 'react'
import smart_toy from '../assets/smart_toy.svg';
import waving_hand from '../assets/waving_hand.svg';
import smart_toy_blue from '../assets/smart_toy_blue.svg';
import waving_hand_blue from '../assets/waving_hand_blue.svg';
import { useAuth } from '../components/AuthContext';



const HomeVisor = () => {

  const { usuario, cargando, logout } = useAuth();

  return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-900">
        <div className="max-w-2xl">
        <div className="flex justify-center items-center space-x-2 mb-2">
          <img className="w-40 h-40" src={smart_toy_blue} alt="smart_toy Logo" />
          <img className="w-20 h-20 mt-4" src={waving_hand_blue} alt="waving_hand Logo" />
        </div>
          <h2 className="text-5xl font-bold text-white mb-4">Bienvenido, {usuario.nombre}</h2>
          <p className="text-xl text-gray-400 mb-10">
            Monitoreá y controlá tu robot móvil con visualización en tiempo real, creación de mapas y control de misiones.
          </p>
        </div>
      </div>
  )
}

export default HomeVisor
