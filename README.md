
<h1 align="center">🤖 Robot Manager v2</h1>
<p align="center">
  <strong>Plataforma web para visualización y control de robots móviles basada en ROS 2, FastAPI y React.</strong>
</p>

![Arquitectura](https://github.com/user-attachments/assets/23c70138-5a4e-4b1c-9c58-41bbbd15aa3b)

<p align="center">
  <img src="![Arquitectura](https://github.com/user-attachments/assets/23c70138-5a4e-4b1c-9c58-41bbbd15aa3b)" alt="Arquitectura del sistema" width="700"/>
</p>

---

## 🚀 Descripción

**Robot Manager v2** es un sistema centralizado de gestión de robots móviles diseñado para:

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
- Visualización de mapas y cámara en tiempo real.
- Control manual mediante joystick.
- Conexión con rosbridge vía `roslibjs`.

### 🔹 Backend (FastAPI + ROS 2 + WebSockets)
- Servidor HTTP para peticiones REST (CRUD de mapas, usuarios, etc.).
- Nodo ROS 2 en Python (`rclpy`) que publica/suscribe a los topics del robot.
- Transforma los datos recibidos y los vuelve a publicar en `/web/*`.
- WebSocket para imágenes, velocidades y comandos.

### 🔹 Robots (ROS 2 Nodes)
- Publican información sensorial como:
  - `/image_raw/compressed`
  - `/scan`
  - `/odom`
- Reciben comandos en `/cmd_vel`.

---

## 📸 Funcionalidades

- 📷 **Visualización de cámara** en tiempo real.
- 🕹️ **Control manual** vía joystick virtual (nippleJS).
- 🧠 **Modo automático** con selección de misiones.
- 🗺️ **Gestión de mapas**: alta, baja y consulta.
- ⚙️ **API RESTful** para extender funcionalidades (usuarios, permisos).
- 💬 **WebSocket y Topics ROS** para conexión en tiempo real.

---

## 🔧 Tecnologías usadas

| Componente | Tecnología |
|-----------|-------------|
| Robótica  | ROS 2 Humble, `rclpy`, `rosbridge_websocket` |
| Backend   | FastAPI, WebSocket, PyMongo |
| Frontend  | React, ROS2DJS, roslibjs, nippleJS |
| Base de datos | MongoDB |

---

## 🗂️ Estructura del proyecto

```
robot_manager_v2/
├── robot_manager_server/
│   ├── server.py        # Backend FastAPI + ROS2
│   └── database/        # Acceso a MongoDB
├── robot_manager_web_app/
│   ├── main.jsx         # Punto de entrada React
│   ├── Camera.jsx       # Módulo cámara
│   ├── MapList.jsx      # CRUD de mapas
│   └── ...              # Otros componentes
└── docs/
    └── arquitectura.png # Imagen del sistema
```

---

## ⚙️ Cómo ejecutar

### 🔵 Requisitos

- ROS 2 Humble instalado
- Python 3.10+
- MongoDB corriendo localmente
- Node.js (para frontend)

### ▶️ Iniciar backend (ROS 2 + FastAPI)

```bash
# En terminal ROS 2 con entorno activado
cd robot_manager_server
python3 server.py
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
- ✅ Control manual y odometría
- ✅ CRUD de mapas
- ⏳ En desarrollo: publicación de `/web/map`, `/web/scan` para visualización con ros2djs
- ⏳ En desarrollo: CRUD de usuarios y autenticación

---

## ✨ Capturas de pantalla

<p align="center">
  <img src="docs/screenshot_home.png" alt="Vista principal" width="600"/>
  <br/>
  <em>Vista principal: mapa, cámara y panel de control.</em>
</p>

---

## 🙋‍♂️ Autor

**Pedro Araujo**  
👨‍💻 Estudiante e investigador en robótica  
📫 [araujopedrop](https://github.com/araujopedrop)

---

## 🪪 Licencia

MIT © 2025 - Uso académico y personal permitido.


























