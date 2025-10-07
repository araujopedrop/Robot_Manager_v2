import React from 'react'
import ManAutoPanel from "../components/ManAutoPanel";
import Split from "react-split";
import MapVisor from "../components/MapVisor";
import CameraVisor from "../components/CameraVisor";

const ManAutoVisor = () => {
  return (
      <div className="p-6 h-[calc(100vh-80px)]">

        <Split
          direction="vertical"
          sizes={[50, 50]}
          minSize={[500, 300]}
          gutterSize={10}
          className="flex flex-col h-full gap-4"
        >
          <Split
            className="flex gap-2"
            direction="horizontal"
            sizes={[75, 25]}
            minSize={[300, 300]}
            maxSize={[Infinity, window.innerWidth / 2]}
            gutterSize={10}
          >
            <div className="min-w-0 h-full">
              <MapVisor />
            </div>

            <div className="min-w-0 h-full">
              <CameraVisor />
            </div>

          </Split>

          <div className="w-full h-full">
            <ManAutoPanel />
          </div>
        </Split>
      </div>
  )
}

export default ManAutoVisor
