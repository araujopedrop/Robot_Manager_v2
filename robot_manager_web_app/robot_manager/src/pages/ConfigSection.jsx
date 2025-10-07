import React from 'react'
import Header from '../components/Header'
import ConfigVisor from '../components/ConfigVisor'

const ConfigSection = () => {
  return (
  <main className="flex-1 bg-gray-900 overflow-hidden flex flex-col">
    <Header />
    <div className="flex-1 overflow-y-auto">
      <ConfigVisor />
    </div>
  </main>

  )
}

export default ConfigSection
