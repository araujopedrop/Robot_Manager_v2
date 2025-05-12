import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RobotManagerApp } from './RobotManagerApp'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RobotManagerApp/>
  </StrictMode>,
)
