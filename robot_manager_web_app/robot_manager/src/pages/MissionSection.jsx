import React from 'react'
import Header from '../components/Header'
import MissionVisor from '../components/MIssionVisor'

const MissionSection = () => {
  return (
    <main className="flex-1 bg-gray-900 overflow-hidden">
      <Header />
      <MissionVisor />
    </main>
  )
}

export default MissionSection
