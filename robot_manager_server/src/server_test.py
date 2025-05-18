#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import CompressedImage
from geometry_msgs.msg import Twist
from fastapi import FastAPI, WebSocket
import threading
import asyncio
import uvicorn
import base64

app = FastAPI()
connected_clients = []

@app.websocket("/ws/image")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    print("🟢 Cliente WebSocket conectado")
    try:
        while True:
            await websocket.receive_text()  # mantener la conexión viva
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

    def listener_callback(self, msg):
        # Convertir los datos JPEG a base64
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