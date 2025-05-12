#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from typing import Union
import threading
import uvicorn
from fastapi import FastAPI, WebSocket
from geometry_msgs.msg import Twist

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

# Endpoint WebSocket
@app.websocket("/ws/cmd_vel")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket conectado")
    while True:
        try:
            data = await websocket.receive_json()
            linear = float(data.get("linear_x", 0.0))
            angular = float(data.get("angular_z", 0.0))

            msg = Twist()
            msg.linear.x = linear
            msg.angular.z = angular

            print("linear: " + str(linear) + " - " + "angular: " + str(angular))

            if WebServerNode.instance:
                WebServerNode.instance.cmd_vel_publisher.publish(msg)

        except Exception as e:
            print(f"WebSocket cerrado o error: {e}")
            break

        


class WebServerNode(Node):
    instance = None

    def __init__(self):
        super().__init__('web_server_node')
        
        # Primero aseguramos que instance esté disponible
        WebServerNode.instance = self

        self.cmd_vel_publisher = self.create_publisher(Twist, '/cmd_vel', 10)
        self.get_logger().info('WebServerNode iniciado')

        # Recién ahora lanzamos FastAPI
        thread = threading.Thread(target=self.run_api_server, daemon=True)
        thread.start()

    def run_api_server(self):
        uvicorn.run(app, host="0.0.0.0", port=8000)

def main(args=None):
    rclpy.init(args=args)
    print("Servidor iniciado")
    node = WebServerNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        rclpy.shutdown()

if __name__ == '__main__':
    main()
