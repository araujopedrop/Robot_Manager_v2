#!/usr/bin/env python3

import rclpy
from rclpy.node        import Node
from geometry_msgs.msg import Twist
from nav_msgs.msg      import Odometry, OccupancyGrid
from sensor_msgs.msg   import CompressedImage
from std_srvs.srv      import Trigger
from sensor_msgs.msg   import LaserScan

from custom_interfaces.srv import SaveMap # type: ignore

import base64
import asyncio
import threading
import uvicorn
from fastapi import FastAPI

from api_handler import ApiHandler

class WebServerNode(Node):
    def __init__(self):
        super().__init__('web_server_node')

        self.cmd_vel_publisher   = self.create_publisher(Twist, '/cmd_vel', 10)
        self.pub_map             = self.create_publisher(OccupancyGrid, '/map_redirected', 10)

        self.sub_map             = self.create_subscription(OccupancyGrid, '/map', self.map_callback, 10)
        self.sub_image           = self.create_subscription(CompressedImage, '/image_raw/compressed', self.image_callback, 10)
        self.sub_odom            = self.create_subscription(Odometry, '/odom', self.odom_callback, 10)
        self.sub_scan            = self.create_subscription(LaserScan, '/scan', self.scan_callback, 10)

        self.cli_start_mapping   = self.create_client(Trigger, 'start_mapping')
        self.cli_stop_mapping    = self.create_client(Trigger, 'stop_mapping')
        self.cli_start_map_saver = self.create_client(SaveMap, 'start_map_saver')
        self.cli_stop_map_saver  = self.create_client(Trigger, 'stop_map_saver')

        self.api_handler = None

        self.get_logger().info("WebServerNode initialized!")

    def map_callback(self, msg):
        self.pub_map.publish(msg)

        if self.api_handler is None:
            return

        # Convertir OccupancyGrid a dict JSON-friendly
        data = {
            "resolution": msg.info.resolution,
            "width": msg.info.width,
            "height": msg.info.height,
            "origin": {
                "x": msg.info.origin.position.x,
                "y": msg.info.origin.position.y
            },
            # ⚠️ En producción, segmentar o comprimir si es muy grande
            "data": list(msg.data)  # muestra solo primeros 300 valores como prueba
        }

        for ws in self.api_handler.map_clients:
            try:
                asyncio.run(ws.send_json(data))
            except Exception as e:
                self.get_logger().warn(f"No se pudo enviar mapa: {e}")


    def image_callback(self, msg):
        if self.api_handler is None:
            return

        image_base64 = base64.b64encode(msg.data).decode('utf-8')
        message = {
            "type": "image",
            "format": msg.format,
            "image_data": image_base64
        }
        for ws in self.api_handler.connected_clients:
            try:
                asyncio.run(ws.send_json(message))
            except Exception as e:
                self.get_logger().warn(f"No se pudo enviar imagen: {e}")

    def odom_callback(self, msg):
        if self.api_handler is None:
            return

        linear = msg.twist.twist.linear.x
        angular = msg.twist.twist.angular.z
        payload = {"linear_x": linear, "angular_z": angular}
        for client in self.api_handler.odom_clients:
            try:
                asyncio.run(client.send_json(payload))
            except Exception as e:
                self.get_logger().warn(f"No se pudo enviar odom: {e}")

    async def call_trigger_service(self, client):
        if not client.wait_for_service(timeout_sec=2.0):
            return {"success": False, "message": "⛔ Servicio no disponible"}

        loop = asyncio.get_event_loop()
        promise = loop.create_future()
        req = Trigger.Request()
        future = client.call_async(req)

        def done_callback(fut):
            try:
                result = fut.result()
                loop.call_soon_threadsafe(promise.set_result, {
                    "success": result.success,
                    "message": result.message
                })
            except Exception as e:
                loop.call_soon_threadsafe(promise.set_result, {
                    "success": False,
                    "message": f"⛔ Error en servicio: {str(e)}"
                })

        future.add_done_callback(done_callback)
        return await promise

    async def call_save_map_service(self, client, nombre: str):
        if not client.wait_for_service(timeout_sec=2.0):
            return {"success": False, "message": "⛔ Servicio no disponible"}

        self.get_logger().warn(f"Guardando mapa")

        loop = asyncio.get_event_loop()
        promise = loop.create_future()
        req = SaveMap.Request()
        req.nombre = nombre
        future = client.call_async(req)

        def done_callback(fut):
            try:
                result = fut.result()
                loop.call_soon_threadsafe(promise.set_result, {
                    "success": result.success,
                    "message": result.message
                })
            except Exception as e:
                loop.call_soon_threadsafe(promise.set_result, {
                    "success": False,
                    "message": f"⛔ Error en servicio: {str(e)}"
                })

        future.add_done_callback(done_callback)
        return await promise
    
    def scan_callback(self, msg):
        if self.api_handler is None:
            return

        payload = {
            "angle_min": msg.angle_min,
            "angle_increment": msg.angle_increment,
            "ranges": list(msg.ranges)
        }

        for client in self.api_handler.scan_clients:
            try:
                asyncio.run(client.send_json(payload))
            except Exception as e:
                self.get_logger().warn(f"No se pudo enviar scan: {e}")


def launch_fastapi(app: FastAPI):
    uvicorn.run(app, host="0.0.0.0", port=8000)

def main():
    rclpy.init()
    node = WebServerNode()

    # Crear manejador FastAPI con referencia al nodo
    api_handler = ApiHandler(node)
    node.api_handler = api_handler  # Asignar referencia para callbacks

    # Ejecutar FastAPI en hilo separado
    thread = threading.Thread(target=launch_fastapi, args=(api_handler.app,), daemon=True)
    thread.start()

    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == "__main__":
    main()
