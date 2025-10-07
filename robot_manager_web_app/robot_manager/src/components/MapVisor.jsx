import React from 'react'
import Map from '../assets/map.png'
import map_icon from '../assets/map.svg'

const MapVisor = () => {
  return (
    <div className="component-card h-full lg:col-span-2">
      <div className="component-header">
        <img src={map_icon} alt="Icono de mapa" className="w-6 h-6 text-blue-400" />
        <h3 className="component-title">Mapa en Tiempo Real</h3>
      </div>
      <div className="component-content h-full">
        <img className="w-full h-full object-cover" src={Map} alt="Mapa del robot" />
      </div>
    </div>
  )
}

export default MapVisor;
