# api_handler.py
from fastapi import FastAPI, WebSocket, HTTPException, Request, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Union, Optional
from pydantic import BaseModel
from geometry_msgs.msg import Twist
from db_handler import DbHandler
from auth import hash_password, verify_password, create_access_token, decode_token
import jwt

class UserRegister(BaseModel):
    email: str
    password: str
    nombre: str

class UserLogin(BaseModel):
    email: str
    password: str

class MapData(BaseModel):
    nombre_mapa: str
    nombre_planta: str

class RobotData(BaseModel):
    nombre_robot: str
    tipo_robot: str
    status_robot: str

class TaskData(BaseModel):
    id: int
    numero: int
    task: str
    arg1: str

class MissionData(BaseModel):
    mission_name: str
    mill_name: str
    mission_status: str
    start_time: str
    end_time: str
    tasks: Optional[List[TaskData]] = []

class WaypointData(BaseModel):
    waypoint_name: str
    x: float
    y: float
    z: float
    AngX: float
    AngY: float
    AngZ: float



class ApiHandler:
    def __init__(self, ros_node):
        self.app = FastAPI()
        self.db_handler = DbHandler()
        self.ros_node = ros_node

        self.connected_clients: List[WebSocket] = []
        self.odom_clients: List[WebSocket] = []
        self.map_clients: List[WebSocket] = []
        self.scan_clients: List[WebSocket] = []

        self.security = HTTPBearer()

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

        # ****************** USERS ENDPOINTS ****************** #
        @self.app.post("/register")
        async def register_user(user: UserRegister):
            if self.db_handler.user_collection.find_one({"email": user.email}):
                raise HTTPException(status_code=400, detail="❌ Usuario ya existe")

            hashed_pw = hash_password(user.password)
            self.db_handler.user_collection.insert_one({
                "email": user.email,
                "hashed_password": hashed_pw,
                "nombre": user.nombre
            })
            return {"success": True, "message": "✅ Usuario registrado correctamente"}

        @self.app.post("/login")
        async def login_user(user: UserLogin):
            db_user = self.db_handler.user_collection.find_one({"email": user.email})
            if not db_user or not verify_password(user.password, db_user["hashed_password"]):
                raise HTTPException(status_code=401, detail="❌ Credenciales inválidas")

            token = create_access_token({"sub": str(db_user["_id"]), "email": user.email})
            return {"access_token": token, "token_type": "bearer"}

        @self.app.get("/me")
        @self.app.get("/me")
        async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(self.security)):
            try:
                payload = decode_token(credentials.credentials)
                user = self.db_handler.user_collection.find_one(
                    {"email": payload["email"]},
                    {"_id": 0, "hashed_password": 0}
                )
                if not user:
                    raise HTTPException(status_code=404, detail="Usuario no encontrado")
                return user
            except jwt.ExpiredSignatureError:
                raise HTTPException(status_code=401, detail="Token expirado")
            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")






        # ****************** MAPS ENDPOINTS ****************** #
        # ************ MAPS ENDPOINTS CRUDs ************ #
        @self.app.get("/maps")
        async def obtener_mapas():
            return list(self.db_handler.map_collection.find({}, {"_id": 0}))

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

        @self.app.patch("/maps/{map_id}")
        async def modificar_mapa(map_id: int, map_data: MapData):

            # Modificar por id
            self.db_handler.map_collection.update_one({ 'id': map_id } , { "$set": { 'nombre_mapa': map_data.nombre_mapa, 'nombre_planta': map_data.nombre_planta , } })

            return {"status": "ok", "id_modified": map_id}

        @self.app.delete("/maps/{map_id}")
        async def delete_map(map_id: int):
            result = self.db_handler.map_collection.delete_one({"id": map_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Mapa no encontrado")
            return {"status": "deleted"}

        # ************ MAPS ENDPOINTS mapping ************ #
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



        # ****************** ROBOTS ENDPOINTS ****************** #
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
        
        @self.app.patch("/robots/{robot_id}")
        async def modificar_robot(robot_id: int, robot_data: RobotData):

            # Modificar por id
            self.db_handler.robot_collection.update_one({ 'id': robot_id } , { "$set": { 'nombre_robot': robot_data.nombre_robot, 'tipo_robot': robot_data.tipo_robot, 'status_robot': robot_data.status_robot,  } })

            return {"status": "ok", "id_modified": robot_id}

        @self.app.delete("/robots/{robot_id}")
        async def delete_robot(robot_id: int):
            result = self.db_handler.robot_collection.delete_one({"id": robot_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Robot no encontrado")
            return {"status": "deleted"}


        # ****************** MISSIONS ENDPOINTS ****************** #
        @self.app.get("/missions")
        async def get_missions():
            return list(self.db_handler.mission_collection.find({}, {"_id": 0}))
        
        @self.app.post("/missions")
        async def create_mission(mission_data: MissionData):
            last_mission = self.db_handler.mission_collection.find_one(sort=[("id", -1)])

            new_id = 1 if not last_mission else last_mission["id"] + 1

            doc = {
                "id": new_id,
                "mission_name": mission_data.mission_name,
                "mill_name": mission_data.mill_name,
                "mission_status": mission_data.mission_status,
                "start_time": mission_data.start_time,
                "end_time": mission_data.end_time,
                "tasks": mission_data.tasks,
            }

            self.db_handler.mission_collection.insert_one(doc)
            return {"status": "ok", "id": new_id}
        
        @self.app.patch("/missions/{mission_id}")
        async def update_mission(mission_id: int, mission_data: MissionData):
            self.db_handler.mission_collection.update_one(
                { 'id': mission_id },
                { "$set": {
                    'mission_name': mission_data.mission_name,
                    'mill_name': mission_data.mill_name,
                    'mission_status': mission_data.mission_status,
                    'start_time': mission_data.start_time,
                    'end_time': mission_data.end_time,
                    'tasks': [task.dict() for task in mission_data.tasks]
                }}
            )
            return {"status": "ok", "id_modified": mission_id}

        @self.app.delete("/missions/{mission_id}")
        async def delete_mission(mission_id: int):
            result = self.db_handler.mission_collection.delete_one({"id": mission_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Mission not founded")
            return {"status": "deleted"}



        # ****************** WAYPOINT ENDPOINTS ****************** #
        @self.app.get("/waypoints")
        async def obtener_waypoints():
            return list(self.db_handler.waypoint_collection.find({}, {"_id": 0}))

        @self.app.post("/waypoints")
        async def guardar_waypoint(waypoint_data: WaypointData):
            last_waypoint = self.db_handler.waypoint_collection.find_one(sort=[("id", -1)])

            new_id = 1 if not last_waypoint else last_waypoint["id"] + 1

            doc = {
                "id": new_id,
                "waypoint_name": waypoint_data.waypoint_name,
                "x": waypoint_data.x,
                "y": waypoint_data.y,
                "z": waypoint_data.z,
                "AngX": waypoint_data.AngX,
                "AngY": waypoint_data.AngY,
                "AngZ": waypoint_data.AngZ,
            }

            self.db_handler.waypoint_collection.insert_one(doc)
            return {"status": "ok", "id": new_id}

        @self.app.patch("/waypoints/{waypoint_id}")
        async def modificar_waypoint(waypoint_id: int, waypoint_data: WaypointData):

            print(waypoint_id)
            print(waypoint_data)

            # Modificar por id
            self.db_handler.waypoint_collection.update_one({ 'id': waypoint_id } , { "$set": { "waypoint_name": waypoint_data.waypoint_name, "x": waypoint_data.x, "y": waypoint_data.y, "z": waypoint_data.z, "AngX": waypoint_data.AngX, "AngY": waypoint_data.AngY, "AngZ": waypoint_data.AngZ} })

            return {"status": "ok", "id_modified": waypoint_id}

        @self.app.delete("/waypoints/{waypoint_id}")
        async def delete_waypoint(waypoint_id: int):
            result = self.db_handler.waypoint_collection.delete_one({"id": waypoint_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Waypoint no encontrado")
            return {"status": "deleted"}






        # ********************************************* ENDPOINTS ********************************************* #

        # ********************************************* WEBSOCKETS ********************************************* #

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

        