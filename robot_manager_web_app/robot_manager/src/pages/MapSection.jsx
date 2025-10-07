import React from 'react';
import SideBar from '../components/sideBar';
import MapListWindow from "../components/MapListWindow";
import Header from '../components/Header';
import MapList from '../components/MapList';

const MapSection = () => {
  return (
    <main className="flex-1 bg-gray-900 overflow-hidden">
      <Header />
      <MapList/>
    </main>
  );
};

export default MapSection;