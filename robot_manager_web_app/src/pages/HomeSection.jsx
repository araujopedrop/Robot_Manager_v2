import React from 'react'
import Header from '../components/Header'
import HomeVisor from '../components/HomeVisor'

const HomeSection = () => {
  return (
    <main className="flex-1 bg-gray-900 overflow-hidden">
      <Header />
      <HomeVisor />
    </main>
  )
}

export default HomeSection
