import React from "react";
import "./styles.css";
import camara from "./assets/camera.png";

const CameraSection = () => {
  return (
    <div className="image-column">
      <img src={camara} alt="Vista de cámara" className="side-image" />
    </div>
  )
}

export default CameraSection
