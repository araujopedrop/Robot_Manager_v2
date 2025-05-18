import React, { useState } from 'react';
import Menu from './Menu';
import MapSection from './Mapa';
import Camera from './Camera';
import PanelDeControl from './PanelDeControl';
import MapList from './MapLIst';

export const RobotManagerApp = () => {
  const [currentView, setCurrentView] = useState('home');

  const renderContent = () => {
    switch (currentView) {
      case 'mapas':
        return (
          <div className="map-list-wrapper">
            <MapList />
          </div>
        );
      case 'home':
      default:
        return (
          <>
            <div className="map-camera-container">
              <div className="map-column">
                <h4 className="map-title">UTN - Planta baja</h4>
                <MapSection />
              </div>
              <div className="camera-column">
                <h4 className="camera-title">Cámara Andino1</h4>
                <Camera />
              </div>
            </div>
            <div className="bottom-section">
              <PanelDeControl />
            </div>
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <Menu setCurrentView={setCurrentView} />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};
