import React from 'react'
import Header from '../components/Header'
import WaypointVisor from '../components/WaypointVisor'

const WaypointsSection = () => {
  return (
    <main className="flex-1 bg-gray-900 overflow-hidden">
        <Header />
        <WaypointVisor />
    </main>
  )
}

export default WaypointsSection
