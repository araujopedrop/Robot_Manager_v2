# api_handler.py
from fastapi import FastAPI, WebSocket, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from geometry_msgs.msg import Twist
from typing            import List
from pydantic          import BaseModel
from db_handler        import DbHandler
from fastapi.responses import JSONResponse

class MapData(BaseModel):
    nombre_mapa: str
    nombre_planta: str

class RobotData(BaseModel):
    nombre_robot: str
    tipo_robot: str
    status_robot: str

class ApiHandler:
    def __init__(self, ros_node):

        self.map_clients: List[WebSocket] = []
        self.scan_clients: List[WebSocket] = []


        self.ros_node = ros_node
        self.app = FastAPI()
        self.db_handler = DbHandler()
        self.connected_clients: List[WebSocket] = []
        self.odom_clients: List[WebSocket] = []

        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        self.define_routes()

    def define_routes(self):

        # ******************************************************* ENDPOINTS *******************************************************

        # ********* USERS ENDPOINTS ********* #

        @self.app.get("/check-auth")
        async def check_auth():
            return True


        # ********* MAPS ENDPOINTS ********* #

        @self.app.post("/maps")
        async def guardar_mapa(map_data: MapData):
            last_map = self.db_handler.map_collection.find_one(sort=[("id", -1)])
            new_id = 1 if not last_map else last_map["id"] + 1
            path = f"/maps/{map_data.nombre_planta.lower().replace(' ', '_')}_{map_data.nombre_mapa.lower().replace(' ', '_')}"

            doc = {
                "id": new_id,
                "nombre_mapa": map_data.nombre_mapa,
                "nombre_planta": map_data.nombre_planta,
                "path": path
            }

            self.db_handler.map_collection.insert_one(doc)
            return {"status": "ok", "id": new_id}

        @self.app.get("/maps")
        async def obtener_mapas():
            return list(self.db_handler.map_collection.find({}, {"_id": 0}))

        @self.app.delete("/maps/{map_id}")
        async def delete_map(map_id: int):
            result = self.db_handler.map_colection.delete_one({"id": map_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Mapa no encontrado")
            return {"status": "deleted"}

        @self.app.post("/start-mapping")
        async def start_mapping():
            return await self.ros_node.call_trigger_service(self.ros_node.cli_start_mapping)

        @self.app.post("/stop-mapping")
        async def stop_mapping():
            return await self.ros_node.call_trigger_service(self.ros_node.cli_stop_mapping)

        @self.app.post("/start-map-saver")
        async def start_map_saver(request: Request):
            print("/start-map-saver")
            body = await request.json()
            nombre = body.get("nombre", "")
            if not nombre:
                return {"success": False, "message": "❌ Nombre requerido"}
            return await self.ros_node.call_save_map_service(self.ros_node.cli_start_map_saver, nombre)

        @self.app.post("/stop-map-saver")
        async def stop_map_saver():
            return await self.ros_node.call_trigger_service(self.ros_node.cli_stop_map_saver)

        @self.app.post("/finalize-mapping")
        async def finalize_mapping(request: Request):
            print("-----------------Guardando mapa---------------")
            try:
                body = await request.json()

                # VER: nombre_mapa y nombre_planta estan vacios
                nombre_mapa = body.get("nombreMapa", "")
                nombre_planta = body.get("nombrePlanta", "")

                if not nombre_mapa or not nombre_planta:
                    return JSONResponse(status_code=400, content={"success": False, "message": "❌ Datos incompletos"})

                # Crear nombre completo
                nombre_completo = f"{nombre_planta}_{nombre_mapa}".lower().replace(" ", "_")

                # Guardar el mapa
                save_result = await self.ros_node.call_save_map_service(self.ros_node.cli_start_and_finalize_map, nombre_completo)
                if not save_result["success"]:
                    return JSONResponse(status_code=500, content={"success": False, "message": "❌ Error al guardar el mapa"})

                return {"success": True, "message": "✅ Mapa guardado y mapeo finalizado"}

            except Exception as e:
                print("❌ EXCEPCIÓN en finalize-mapping:", str(e))
                return JSONResponse(status_code=500, content={"success": False, "message": f"❌ Error interno: {str(e)}"})


        # ********* ROBOTS ENDPOINTS ********* #

        @self.app.get("/robots")
        async def obtener_robots():
            return list(self.db_handler.robot_collection.find({}, {"_id": 0}))
    

        @self.app.post("/robots")
        async def guardar_robot(robot_data: RobotData):
            last_robot = self.db_handler.robot_collection.find_one(sort=[("id", -1)])
            new_id = 1 if not last_robot else last_robot["id"] + 1

            doc = {
                "id": new_id,
                "nombre_robot": robot_data.nombre_robot,
                "tipo_robot": robot_data.tipo_robot,
                "status_robot": robot_data.status_robot,

            }

            self.db_handler.robot_collection.insert_one(doc)
            return {"status": "ok", "id": new_id}
        

        @self.app.delete("/robots/{robot_id}")
        async def delete_robot(robot_id: int):
            result = self.db_handler.robot_collection.delete_one({"id": robot_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Robot no encontrado")
            return {"status": "deleted"}

        # ********************************************* ENDPOINTS *********************************************

        @self.app.websocket("/ws/cmd_vel")
        async def websocket_cmd_vel(websocket: WebSocket):
            await websocket.accept()
            try:
                while True:
                    data = await websocket.receive_json()
                    linear = float(data.get("linear_x", 0.0))
                    angular = float(data.get("angular_z", 0.0))

                    msg = Twist()
                    msg.linear.x = linear * 1.2
                    msg.angular.z = angular * 1.2

                    self.ros_node.cmd_vel_publisher.publish(msg)
            except Exception as e:
                print(f"⚠️ WebSocket cerrado: {e}")

        @self.app.websocket("/ws/odom")
        async def websocket_odom(websocket: WebSocket):
            await websocket.accept()
            self.odom_clients.append(websocket)
            try:
                while True:
                    await websocket.receive_text()
            except:
                self.odom_clients.remove(websocket)

        @self.app.websocket("/ws/image")
        async def websocket_image(websocket: WebSocket):
            await websocket.accept()
            self.connected_clients.append(websocket)
            try:
                while True:
                    await websocket.receive_text()
            except:
                self.connected_clients.remove(websocket)

        @self.app.websocket("/ws/map")
        async def websocket_map(websocket: WebSocket):
            await websocket.accept()
            self.map_clients.append(websocket)
            try:
                while True:
                    await websocket.receive_text()  # mantener conexión viva
            except:
                self.map_clients.remove(websocket)

        @self.app.websocket("/ws/scan")
        async def websocket_scan(websocket: WebSocket):
            await websocket.accept()
            self.scan_clients.append(websocket)
            try:
                while True:
                    await websocket.receive_text()  # mantiene la conexión
            except:
                self.scan_clients.remove(websocket)

        