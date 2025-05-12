import React from 'react'
import Menu from './Menu'
import MapSection from './Mapa'
import CameraSection from './Camera';
import ManualJog from './ManualJog';

export const RobotManagerApp = () => {
  return (
    <>
        <div className="app-container">
        <Menu />
        <div className="main-content">
            <div className="map-section-row">
            <MapSection />
            <CameraSection />
            </div>
            <div className="bottom-section">
            <ManualJog />
            </div>
        </div>
        </div>
    </>
  )
}
 