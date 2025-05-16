import React from 'react'
import Menu from './Menu'
import MapSection from './Mapa'
import Camera from './Camera';
import PanelDeControl from './PanelDeControl';

export const RobotManagerApp = () => {
  return (
    <>
        <div className="app-container">
            <Menu />
            <div className="main-content">
                <div className="map-section-row">
                    <MapSection />
                    <Camera />
                </div>
                <div className="bottom-section">
                    <PanelDeControl />
                </div>
            </div>
        </div>
    </>
  )
}
 