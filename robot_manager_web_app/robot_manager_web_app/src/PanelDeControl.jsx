import React, { useState } from "react";
import ManualMode from "./ManualMode";
import AutoMode from "./AutoMode";
import "./styles.css";

const PanelDeControl = () => {
  const [modo, setModo] = useState("manual");

  const handleSlide = (event) => {
    setModo(event.target.value);
  };

  return (
    <div className="panel-control">
      <h2>Panel de Control</h2>

      <div className="modo-selector">
        <label>
          <input
            type="radio"
            name="modo"
            value="manual"
            checked={modo === "manual"}
            onChange={handleSlide}
          />
          Manual
        </label>

        <label>
          <input
            type="radio"
            name="modo"
            value="auto"
            checked={modo === "auto"}
            onChange={handleSlide}
          />
          Automático
        </label>
      </div>

      {modo === "manual" ? <ManualMode /> : <AutoMode />}
    </div>
  );
};

export default PanelDeControl;
