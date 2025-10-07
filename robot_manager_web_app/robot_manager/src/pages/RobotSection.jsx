import React from 'react'
import Header from '../components/Header'
import RobotVisor from '../components/RobotVisor'

const RobotSection = () => {
  return (
    <main className="flex-1 bg-gray-900 overflow-hidden">
      <Header />
      <RobotVisor />
    </main>
  )
}

export default RobotSection
