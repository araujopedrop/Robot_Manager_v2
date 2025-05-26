
<h1 align="center">🤖 Robot Manager </h1>
<p align="center">
  <strong>Plataforma web para visualización y control de robots móviles basada en ROS 2, FastAPI y React.</strong>
</p>


![Arquitectura](https://github.com/user-attachments/assets/23c70138-5a4e-4b1c-9c58-41bbbd15aa3b)

---

## 🚀 Descripción

**Robot Manager** es un sistema centralizado de gestión de robots móviles diseñado para:

- Visualizar cámaras, mapas y datos sensoriales.
- Controlar el movimiento del robot en tiempo real.
- Administrar mapas, misiones, usuarios y roles.
- Servirse de tecnologías modernas como **ROS 2 Humble**, **FastAPI**, **MongoDB** y **React**.

Está pensado para ser escalable, modular y fácil de usar desde cualquier navegador.

---

## 🧱 Arquitectura

La arquitectura se divide en tres capas principales:

### 🔹 Frontend (React + ROS2DJS)
- Interfaz web responsive.
- Comunicacion con el servidor mediante FastApi y Rosbridge

### 🔹 Backend (FastAPI + ROS 2 + WebSockets)
- Servidor HTTP para peticiones REST (CRUD de mapas, usuarios, etc.).
- Nodo ROS 2 en Python (`rclpy`) que publica/suscribe a los topics del robot, y se comunica con el Frontend mediante Rosbridge
- Comunicacion con base de datos MongoDB

### 🔹 Robots (ROS 2 Humble Hawksbill)
- Robots fisicos, del tipo diffdrive. Ver proyecto: [[https://github.com/Ekumen-OS/andino](https://github.com/Ekumen-OS/andino)]

---

## 📸 Funcionalidades

- 📷 **Visualización de info de robots** en tiempo real, como camara, laser scanner y odomoteria.
- 🕹️ **Control manual** vía joystick.
- 🧠 **Modo automático** con selección de misiones.
- 🗺️ **Gestión de mapas**: alta, baja y consulta.
- 🧑 **Gestión de usuarios**: alta, baja y consulta.
- ⚙️ **Gestión de roles**: alta, baja, consulta y asignacion.
- 💬 **Conexion mediante WebSockets y Topics ROS** para conexión en tiempo real.

---

## 🔧 Tecnologías usadas

| Componentes | Tecnologías |
|-----------|-------------|
| Robótica  | C++, ROS 2 Humble Hawksbill, `rclcpp`|
| Frontend  | React, rosbridge, `roslibjs`, `ros2djs` |
| Backend   | Python, FastAPI, WebSocket, ROS 2 Humble Hawksbill,`rclcpy`, `PyMongo` |
| Base de datos | MongoDB |

--- 

## 🗂️ Estructura del proyecto

```
robot_manager_v2/
├── robot_manager_server/ # Paquete ROS
│   ├── src/
|       ├── server.py     # Backend FastAPI + ROS2
|   ├── CMakeLists.txt
│   └── package.xml
├── robot_manager_web_app/ # Aplicacion REACT
|   ├── robot_manager_web_app
|       ├── src/
|           ├── main.jsx             # Punto de entrada React
|           ├── RobotManagerApp.jsx  # Componente principal
|           ├── Camera.jsx           # Módulo cámara
|           ├── MapList.jsx          # CRUD de mapas
|           └── ...
|       └── ...
|   ├── package-lock.json


```

---

## ⚙️ Cómo ejecutar

### 🔵 Requisitos

- ROS 2 Humble instalado
- Python 3.10+
- MongoDB
- Node.js (para frontend)

### ▶️ Iniciar backend (ROS 2 + FastAPI)

```bash
# En terminal ROS 2 con entorno activado
cd robot_manager_server
ros2 run robot_manager_server server.py
```

### 🟢 Iniciar frontend

```bash
cd robot_manager_web_app
npm install
npm run dev
```

Accedé desde: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Endpoints HTTP disponibles

| Método | Endpoint         | Descripción                |
|--------|------------------|----------------------------|
| GET    | `/maps`          | Obtener todos los mapas    |
| POST   | `/maps`          | Guardar un nuevo mapa      |
| DELETE | `/maps/{map_id}` | Eliminar un mapa por ID    |

---

## 🧪 Estado actual

- ✅ Visualización de cámara en tiempo real
- ✅ Control manual
- ✅ CRUD de mapas
- ⏳ En desarrollo: Visualización de odometria
- ⏳ En desarrollo: CRUD de usuarios y autenticación
- ⏳ En desarrollo: CRUD de roles y permisos
- ⏳ En desarrollo: Resto de Endpoints
- ⏳ En desarrollo: Integracion con RosBridge
- ⏳ En desarrollo: Visualización con ros2djs
- ⏳ En desarrollo: Pruebas con mas de 1 robot
- ⏳ En desarrollo: Integracion con OpenRMF

---

## ✨ Capturas de pantalla

<p align="center">
  <img src="docs/screenshot_home.png" alt="Vista principal" width="600"/>
  <br/>
  <em>Vista principal: mapa, cámara y panel de control.</em>
</p>

---

## 🪪 Licencia

MIT © 2025 - Uso académico y personal permitido.


























