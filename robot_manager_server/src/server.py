#!/usr/bin/env python3

import rclpy
from rclpy.node import Node

from sensor_msgs.msg   import CompressedImage
from geometry_msgs.msg import Twist
from nav_msgs.msg      import Odometry

from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import threading
import asyncio
import uvicorn
import base64

from pymongo import MongoClient

# --- MongoDB setup ---
mongo_client = MongoClient("mongodb://localhost:27017")
db = mongo_client["robot_manager"]
collection = db["mapas"]

# --- FastAPI setup ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients = []
odom_clients = []

# --- Modelo para mapas ---
class MapData(BaseModel):
    nombre_mapa: str
    nombre_planta: str

@app.post("/maps")
async def guardar_mapa(map_data: MapData):
    last_map = collection.find_one(sort=[("id", -1)])
    new_id = 1 if not last_map else last_map["id"] + 1
    path = f"/maps/{map_data.nombre_planta.lower().replace(' ', '_')}_{map_data.nombre_mapa.lower().replace(' ', '_')}"

    doc = {
        "id": new_id,
        "nombre_mapa": map_data.nombre_mapa,
        "nombre_planta": map_data.nombre_planta,
        "path": path
    }

    collection.insert_one(doc)
    print(f"🗺️ Guardado en MongoDB: {doc}")
    return {"status": "ok", "id": new_id}

@app.get("/maps")
async def obtener_mapas():
    mapas = list(collection.find({}, {"_id": 0}))
    return mapas

@app.delete("/maps/{map_id}")
async def delete_map(map_id: int):
    result = collection.delete_one({"id": map_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Mapa no encontrado")
    return {"status": "deleted"}


@app.websocket("/ws/image")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    print("🟢 Cliente WebSocket conectado")
    try:
        while True:
            await websocket.receive_text()
    except Exception as e:
        print(f"🔴 Cliente desconectado: {e}")
    finally:
        connected_clients.remove(websocket)

@app.websocket("/ws/cmd_vel")
async def websocket_cmd_vel(websocket: WebSocket):
    await websocket.accept()
    print("✅ WebSocket conectado (/ws/cmd_vel)")
    try:
        while True:
            data = await websocket.receive_json()
            linear = float(data.get("linear_x", 0.0))
            angular = float(data.get("angular_z", 0.0))

            msg = Twist()
            msg.linear.x = linear
            msg.angular.z = angular

            if WebServerNode.instance:
                WebServerNode.instance.cmd_vel_publisher.publish(msg)
    except Exception as e:
        print(f"⚠️ WebSocket cerrado o error en /ws/cmd_vel: {e}")

@app.websocket("/ws/odom")
async def odom_ws(websocket: WebSocket):
    await websocket.accept()
    odom_clients.append(websocket)
    print("🛰️ Cliente conectado a /ws/odom")

    try:
        while True:
            await websocket.receive_text()
    except Exception as e:
        print(f"⚠️ Cliente /ws/odom desconectado: {e}")
    finally:
        odom_clients.remove(websocket)

# --- Nodo ROS ---
class WebServerNode(Node):
    def __init__(self):
        super().__init__('web_server_node')
        WebServerNode.instance = self

        self.cmd_vel_publisher = self.create_publisher(Twist, '/cmd_vel', 10)

        self.subscription = self.create_subscription(
            CompressedImage,
            '/image_raw/compressed',
            self.listener_callback,
            10)
        self.get_logger().info('✅ Subscrito a /image_raw/compressed')

        self.sub_odom = self.create_subscription(
            Odometry,
            "/odom",
            self.odom_callback,
            10
        )

    def listener_callback(self, msg):
        image_base64 = base64.b64encode(msg.data).decode('utf-8')
        message = {
            "type": "image",
            "format": msg.format,
            "image_data": image_base64
        }

        for ws in connected_clients:
            try:
                asyncio.run(ws.send_json(message))
            except Exception as e:
                self.get_logger().warn(f"No se pudo enviar imagen al WebSocket: {e}")

    def odom_callback(self, msg):
        linear = msg.twist.twist.linear.x
        angular = msg.twist.twist.angular.z
        payload = {"linear_x": linear, "angular_z": angular}

        for client in odom_clients:
            try:
                asyncio.run(client.send_json(payload))
            except Exception as e:
                self.get_logger().warn(f"No se pudo enviar velocidades al WebSocket: {e}")


def ros2_spin():
    rclpy.init()
    node = WebServerNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    ros_thread = threading.Thread(target=ros2_spin, daemon=True)
    ros_thread.start()

    uvicorn.run(app, host="0.0.0.0", port=8000)
